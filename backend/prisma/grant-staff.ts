import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { E_StaffRole, PrismaClient } from '@prisma/client';
import { normalizeEmail } from '../src/common/utils/normalize-email.util';

/**
 * Lets a registered user sign in to the CMS with a password, before root and hardware keys
 * are set up. The account stays pending (no approvedAt), so backend routes that need an
 * approved staff member still refuse it. Running this takes access to the server.
 */

const GRANTABLE_ROLES = Object.values(E_StaffRole).filter(
  role => role !== E_StaffRole.ROOT,
);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const isGrantableRole = (role: string): role is E_StaffRole =>
  (GRANTABLE_ROLES as string[]).includes(role);

async function main() {
  const [rawEmail, role] = process.argv.slice(2).filter(arg => arg !== '--');

  if (!rawEmail || !role || !isGrantableRole(role)) {
    console.error(
      `Usage: pnpm --filter backend admin:grant-staff <email> <${GRANTABLE_ROLES.join('|')}>`,
    );
    process.exitCode = 1;
    return;
  }

  const email = normalizeEmail(rawEmail);
  const user = await prisma.user.findUnique({
    where: { email },
    include: { staffAccount: true },
  });

  if (!user) {
    console.error(`${email} has no account. Register it first.`);
    process.exitCode = 1;
    return;
  }
  if (!user.emailVerifiedAt) {
    console.error(`${email} is not verified yet. Confirm the email first.`);
    process.exitCode = 1;
    return;
  }
  if (user.staffAccount?.role === E_StaffRole.ROOT) {
    console.error(`${email} is a root admin, this command does not change it.`);
    process.exitCode = 1;
    return;
  }

  await prisma.$transaction([
    prisma.staffAccount.upsert({
      where: { userId: user.id },
      create: { userId: user.id, role },
      update: { role, approvedAt: null, approvedById: null, revokedAt: null },
    }),
    prisma.auditLog.create({
      data: {
        action: 'staff.cli_grant',
        targetId: user.id,
        meta: { role },
      },
    }),
  ]);

  console.log(`${email} can now sign in to the CMS as ${role} (pending).`);
}

main()
  .catch(e => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
