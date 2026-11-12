import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { SEED_USERS } from './seed-data/users';

/**
 * Development only: brings the accounts back to the seed state. Every user not listed in
 * `seed-data/users.ts` (root included) is deleted with its sessions, tokens and keys; the seed
 * accounts get `SEED_USER_PASSWORD`, a verified email, their seed role and no keys.
 * The audit log is cleared. Content (collections, banners, media, seasons) stays.
 * Without `--confirm` it only prints what it would do.
 */

const BCRYPT_ROUNDS = 12;
const CONFIRM_FLAG = '--confirm';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('Refused: NODE_ENV is production.');
    process.exitCode = 1;
    return;
  }
  const password = process.env.SEED_USER_PASSWORD;
  if (!password || password.length < 8 || Buffer.byteLength(password) > 72) {
    console.error(
      'Set SEED_USER_PASSWORD (8 characters to 72 bytes) in backend/.env.',
    );
    process.exitCode = 1;
    return;
  }

  const seedEmails = SEED_USERS.map(({ email }) => email);
  const extraUsers = await prisma.user.findMany({
    where: { email: { notIn: seedEmails } },
    select: { id: true, email: true, staffAccount: { select: { role: true } } },
  });
  const counts = {
    tokens: await prisma.token.count(),
    oneTimeTokens: await prisma.oneTimeToken.count(),
    keys: await prisma.webAuthnCredential.count(),
    auditLog: await prisma.auditLog.count(),
  };

  console.log(`Users to delete (${extraUsers.length}):`);
  for (const { email, staffAccount } of extraUsers) {
    console.log(`  ${email}${staffAccount ? ` (${staffAccount.role})` : ''}`);
  }
  console.log(`Seed accounts to reset: ${seedEmails.join(', ')}`);
  console.log(
    `Also removed: ${counts.tokens} sessions, ${counts.oneTimeTokens} one-time tokens, ${counts.keys} keys, ${counts.auditLog} audit entries.`,
  );

  if (!process.argv.includes(CONFIRM_FLAG)) {
    console.log(`\nDry run. Add ${CONFIRM_FLAG} to apply.`);
    return;
  }

  const passwordHash = await hash(password, BCRYPT_ROUNDS);
  const now = new Date();
  const extraIds = extraUsers.map(({ id }) => id);

  await prisma.$transaction(async tx => {
    await tx.token.deleteMany();
    await tx.oneTimeToken.deleteMany();
    await tx.webAuthnCredential.deleteMany();
    await tx.webAuthnChallenge.deleteMany();
    await tx.auditLog.deleteMany();
    //COMMENT no foreign key on media.uploaded_by_id, so it is cleared by hand
    await tx.media.updateMany({
      where: { uploadedById: { in: extraIds } },
      data: { uploadedById: null },
    });
    await tx.user.deleteMany({ where: { id: { in: extraIds } } });

    for (const { email, name, role } of SEED_USERS) {
      const { id: userId } = await tx.user.upsert({
        where: { email },
        create: { email, name, password: passwordHash, emailVerifiedAt: now },
        update: { name, password: passwordHash, emailVerifiedAt: now },
      });
      if (role) {
        const account = {
          role,
          approvedAt: now,
          approvedById: null,
          revokedAt: null,
        };
        await tx.staffAccount.upsert({
          where: { userId },
          create: { userId, ...account },
          update: account,
        });
      } else {
        await tx.staffAccount.deleteMany({ where: { userId } });
      }
    }
  });

  console.log(
    '\nDone. Clear ROOT_USER_IDS and ROOT_CREDENTIAL_IDS in backend/.env: their root is gone.',
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
