import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { SEED_USERS } from './seed-data/users';

/**
 * Development only: brings the accounts back to the seed state. Every staff account and
 * customer not listed in `seed-data/users.ts` (root included) is deleted with its sessions,
 * links and keys; the seed accounts get `SEED_USER_PASSWORD`, a verified email, their seed
 * role and no keys. The audit log is cleared. Content (collections, banners, media, seasons)
 * stays. Without `--confirm` it only prints what it would do.
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

  const seedStaff = SEED_USERS.filter(({ role }) => role);
  const seedCustomers = SEED_USERS.filter(({ role }) => !role);
  const extraStaff = await prisma.staffUser.findMany({
    where: { email: { notIn: seedStaff.map(({ email }) => email) } },
    select: { id: true, email: true, role: true },
  });
  const extraCustomers = await prisma.customer.findMany({
    where: { email: { notIn: seedCustomers.map(({ email }) => email) } },
    select: { id: true, email: true },
  });
  const counts = {
    sessions:
      (await prisma.staffSession.count()) +
      (await prisma.customerSession.count()),
    links:
      (await prisma.staffToken.count()) + (await prisma.customerToken.count()),
    keys: await prisma.webAuthnCredential.count(),
    auditLog: await prisma.auditLog.count(),
  };

  console.log(`Staff accounts to delete (${extraStaff.length}):`);
  for (const { email, role } of extraStaff) {
    console.log(`  ${email} (${role})`);
  }
  console.log(`Customers to delete (${extraCustomers.length}):`);
  for (const { email } of extraCustomers) {
    console.log(`  ${email}`);
  }
  console.log(
    `Seed accounts to reset: ${SEED_USERS.map(({ email }) => email).join(', ')}`,
  );
  console.log(
    `Also removed: ${counts.sessions} sessions, ${counts.links} one-time links, ${counts.keys} keys, ${counts.auditLog} audit entries.`,
  );

  if (!process.argv.includes(CONFIRM_FLAG)) {
    console.log(`\nDry run. Add ${CONFIRM_FLAG} to apply.`);
    return;
  }

  const passwordHash = await hash(password, BCRYPT_ROUNDS);
  const now = new Date();
  const extraStaffIds = extraStaff.map(({ id }) => id);

  await prisma.$transaction(async tx => {
    await tx.staffSession.deleteMany();
    await tx.customerSession.deleteMany();
    await tx.staffToken.deleteMany();
    await tx.customerToken.deleteMany();
    await tx.webAuthnCredential.deleteMany();
    await tx.webAuthnChallenge.deleteMany();
    await tx.auditLog.deleteMany();
    //COMMENT no foreign key on media.uploaded_by_id, so it is cleared by hand
    await tx.media.updateMany({
      where: { uploadedById: { in: extraStaffIds } },
      data: { uploadedById: null },
    });
    await tx.staffUser.deleteMany({ where: { id: { in: extraStaffIds } } });
    await tx.customer.deleteMany({
      where: { id: { in: extraCustomers.map(({ id }) => id) } },
    });

    for (const { email, name, role } of seedStaff) {
      if (!role) {
        continue;
      }
      const account = {
        name,
        role,
        password: passwordHash,
        emailVerifiedAt: now,
        revokedAt: null,
      };
      await tx.staffUser.upsert({
        where: { email },
        create: { email, ...account },
        update: account,
      });
    }
    for (const { email } of seedCustomers) {
      await tx.customer.updateMany({
        where: { email },
        data: { password: passwordHash, emailVerifiedAt: now },
      });
    }
  });

  console.log(
    '\nDone. Clear ROOT_USER_IDS and ROOT_CREDENTIAL_IDS in backend/.env: their root is gone. Run prisma:seed to recreate a missing seed customer.',
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
