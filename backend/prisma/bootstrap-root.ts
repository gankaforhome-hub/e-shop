import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  E_OneTimeTokenPurpose,
  E_StaffRole,
  PrismaClient,
} from '@prisma/client';
import { hash } from 'bcrypt';
import { isEmail } from 'class-validator';
import { randomBytes } from 'crypto';
import { normalizeEmail } from '../src/common/utils/normalize-email.util';
import { generateToken, hashToken } from '../src/common/utils/token.util';

/**
 * The only way to create a root admin; no HTTP route can.
 * Running it takes access to the server, which a stolen mailbox does not give.
 * It does not verify the email: the owner still has to prove the mailbox as usual.
 */

const BCRYPT_ROUNDS = 12;
const ENROLLMENT_CODE_LIFETIME_MS = 15 * 60 * 1000;
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

  const email = normalizeEmail(rawEmail);
  const existing = await prisma.user.findUnique({ where: { email } });

  //COMMENT anyone could have registered this address first, so an existing account
  //is never promoted as it is: its password may belong to a stranger
  if (existing && !isReset) {
    console.error(
      `${email} already has an account. To take it over and clear its password, sessions and keys, add ${RESET_FLAG}.`,
    );
    process.exitCode = 1;
    return;
  }

  const password = randomBytes(24).toString('base64url');
  const passwordHash = await hash(password, BCRYPT_ROUNDS);
  const enrollmentCode = generateToken();

  const user = await prisma.$transaction(async tx => {
    const { id: userId } = await tx.user.upsert({
      where: { email },
      create: { email, password: passwordHash },
      update: { password: passwordHash, emailVerifiedAt: null },
    });

    await tx.token.deleteMany({ where: { userId } });
    await tx.oneTimeToken.deleteMany({ where: { userId } });
    await tx.webAuthnCredential.deleteMany({ where: { userId } });
    await tx.webAuthnChallenge.deleteMany({ where: { userId } });

    const now = new Date();
    await tx.staffAccount.upsert({
      where: { userId },
      create: { userId, role: E_StaffRole.ROOT, approvedAt: now },
      update: { role: E_StaffRole.ROOT, approvedAt: now, revokedAt: null },
    });
    await tx.oneTimeToken.create({
      data: {
        hash: hashToken(enrollmentCode),
        userId,
        purpose: E_OneTimeTokenPurpose.STAFF_ENROLLMENT,
        expires: new Date(now.getTime() + ENROLLMENT_CODE_LIFETIME_MS),
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

  console.log(`
Root account prepared for ${email}. These values are shown only once.

  ROOT_USER_IDS        ${user.id}
  Temporary password   ${password}
  Enrollment code      ${enrollmentCode}  (valid for 15 minutes, one key)

Next steps:
  1. Add the user id to ROOT_USER_IDS on the server.
  2. Verify the email: POST /api/auth/resend-verification, then POST /api/auth/verify-email.
  3. Sign in to the CMS: POST /api/auth/cms/sign-in.
  4. Register a hardware key with the enrollment code: /api/auth/cms/webauthn/register/*.
  5. Add the returned credential id to ROOT_CREDENTIAL_IDS and restart the API.
  6. Sign in with that key, then register a spare key the same way, without a code.
     Add its id to ROOT_CREDENTIAL_IDS too and keep the key in a safe place.
  7. Change the temporary password: POST /api/auth/change-password.
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
