import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { E_StaffRole, E_StaffTokenPurpose, PrismaClient } from '@prisma/client';
import { isEmail } from 'class-validator';
import { randomBytes } from 'crypto';
import { normalizeEmail } from '../src/common/utils/normalize-email.util';
import { generateToken, hashToken } from '../src/common/utils/token.util';

/**
 * The only way to create a root admin; no HTTP route can.
 * Runs against the database of DATABASE_URL, so every environment gets its own root.
 * Prints a set-password link instead of sending it: running the command already proves
 * access to the server, and it works before any mail provider is set up.
 * The link is the same as a team invitation: opening it sets the password and confirms the email.
 */

const INVITE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const RESET_FLAG = '--reset-credentials';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const args = process.argv.slice(2).filter(arg => arg !== '--');
  const isReset = args.includes(RESET_FLAG);
  const [rawEmail] = args.filter(arg => arg !== RESET_FLAG);

  if (!rawEmail || !isEmail(rawEmail)) {
    console.error(
      `Usage: pnpm --filter backend admin:bootstrap-root <email> [${RESET_FLAG}]`,
    );
    process.exitCode = 1;
    return;
  }

  const cmsUrl = process.env.CMS_URL;
  if (!cmsUrl) {
    console.error(
      'CMS_URL is not set: it is the CMS address the link opens (e.g. http://localhost:3030)',
    );
    process.exitCode = 1;
    return;
  }

  const email = normalizeEmail(rawEmail);
  const existing = await prisma.staffUser.findUnique({ where: { email } });

  //COMMENT staff accounts are separate from customers; an existing staff account is only taken
  //over on purpose, because its password and keys are cleared
  if (existing && !isReset) {
    console.error(
      `${email} already has a staff account. To make it root and clear its password, sessions and keys, add ${RESET_FLAG}.`,
    );
    process.exitCode = 1;
    return;
  }

  const token = generateToken();

  const user = await prisma.$transaction(async tx => {
    const { id: userId } = await tx.staffUser.upsert({
      where: { email },
      create: { email, role: E_StaffRole.ROOT },
      update: {
        role: E_StaffRole.ROOT,
        password: null,
        emailVerifiedAt: null,
        revokedAt: null,
      },
    });

    await tx.staffSession.deleteMany({ where: { userId } });
    await tx.staffToken.deleteMany({ where: { userId } });
    await tx.webAuthnCredential.deleteMany({ where: { userId } });
    await tx.webAuthnChallenge.deleteMany({ where: { userId } });

    await tx.staffToken.create({
      data: {
        hash: hashToken(token),
        userId,
        purpose: E_StaffTokenPurpose.INVITE,
        expires: new Date(Date.now() + INVITE_LIFETIME_MS),
      },
    });
    await tx.auditLog.create({
      data: {
        action: 'staff.root_bootstrap',
        targetId: userId,
        meta: { isReset },
      },
    });

    return { id: userId };
  });

  const link = `${new URL('/accept-invite', cmsUrl).href}#token=${token}`;
  // A fresh value for the server env; the database never stores it
  const enrollmentCode = randomBytes(32).toString('base64url');

  console.log(`
Root account prepared for ${email}. These values are shown only once.

  ROOT_USER_IDS          ${user.id}
  ROOT_ENROLLMENT_CODE   ${enrollmentCode}
  Set-password link      ${link}
                         (valid for 7 days, one use)

Next steps:
  1. In the env of this environment: add the id to ROOT_USER_IDS (comma-separated) and set
     ROOT_ENROLLMENT_CODE to the value above. Restart the API.
  2. Open the link and set the password: you are signed in to the CMS.
  3. The CMS asks for the enrollment code and a key (Windows Hello, Touch ID, phone, USB key).
     It shows the id of the new key: add it to ROOT_CREDENTIAL_IDS and restart the API.
  4. Confirm the sign-in with the key: root rights start now (only in key-confirmed sessions).
  5. Profile (/account): add a spare key, add its id to ROOT_CREDENTIAL_IDS too.
  6. Clear ROOT_ENROLLMENT_CODE in env and restart the API.
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
