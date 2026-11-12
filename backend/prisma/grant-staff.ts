import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { E_StaffRole, E_StaffTokenPurpose, PrismaClient } from '@prisma/client';
import { isEmail } from 'class-validator';
import { normalizeEmail } from '../src/common/utils/normalize-email.util';
import { generateToken, hashToken } from '../src/common/utils/token.util';

/**
 * Creates (or re-roles) a staff account from the server and prints its set-password link, like
 * a team invitation without the email. Normally an ADMIN or root invites people in
 * Settings → Team instead. Staff accounts are separate from customers: a customer with the same
 * email is not touched. ROOT is only created by admin:bootstrap-root.
 */

const GRANTABLE_ROLES = Object.values(E_StaffRole).filter(
  role => role !== E_StaffRole.ROOT,
);
const INVITE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const isGrantableRole = (role: string): role is E_StaffRole =>
  (GRANTABLE_ROLES as string[]).includes(role);

async function main() {
  const [rawEmail, role] = process.argv.slice(2).filter(arg => arg !== '--');

  if (!rawEmail || !isEmail(rawEmail) || !role || !isGrantableRole(role)) {
    console.error(
      `Usage: pnpm --filter backend admin:grant-staff <email> <${GRANTABLE_ROLES.join('|')}>`,
    );
    process.exitCode = 1;
    return;
  }

  const cmsUrl = process.env.CMS_URL;
  if (!cmsUrl) {
    console.error('CMS_URL is not set: it is the CMS address the link opens');
    process.exitCode = 1;
    return;
  }

  const email = normalizeEmail(rawEmail);
  const existing = await prisma.staffUser.findUnique({ where: { email } });
  if (existing?.role === E_StaffRole.ROOT) {
    console.error(`${email} is a root admin, this command does not change it.`);
    process.exitCode = 1;
    return;
  }

  const token = generateToken();
  const staff = await prisma.$transaction(async tx => {
    const user = await tx.staffUser.upsert({
      where: { email },
      create: { email, role },
      update: { role, revokedAt: null },
    });
    await tx.staffToken.deleteMany({
      where: { userId: user.id, purpose: E_StaffTokenPurpose.INVITE },
    });
    //COMMENT an account that already has a password just gets the role; no link needed
    if (!user.password) {
      await tx.staffToken.create({
        data: {
          hash: hashToken(token),
          userId: user.id,
          purpose: E_StaffTokenPurpose.INVITE,
          expires: new Date(Date.now() + INVITE_LIFETIME_MS),
        },
      });
    }
    await tx.auditLog.create({
      data: { action: 'staff.cli_grant', targetId: user.id, meta: { role } },
    });
    return user;
  });

  if (staff.password) {
    console.log(`${email} can sign in to the CMS as ${role}.`);
    return;
  }
  const link = `${new URL('/accept-invite', cmsUrl).href}#token=${token}`;
  console.log(`
${email} is a ${role} now. The link is shown only once (7 days, one use):

  ${link}

Opening it and setting the password signs the person in to the CMS.
`);
}

main()
  .catch(e => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
