import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();
async function main() {
  // const post1 = await prisma.user.upsert({
  //   where: { email: 'gmaksym@bigmir.net' },
  //   update: {},
  //   create: {
  //     email: 'gmaksym@bigmir.net',
  //     password: '1234',
  //     name: 'Maksym',
  //     role: 'ADMIN',
  //   },
  // });
  // const post2 = await prisma.user.upsert({
  //   where: { email: 'golena@bigmir.net' },
  //   update: {},
  //   create: {
  //     email: 'golena@bigmir.net',
  //     password: '1234',
  //     name: 'Olenka',
  //   },
  // });
  // const post3 = await prisma.user.upsert({
  //   where: { email: 'gmaxim@bigmir.net' },
  //   update: {},
  //   create: {
  //     email: 'gmaxim@bigmir.net',
  //     password: '1234',
  //     name: 'Maksym',
  //     role: 'MANAGER',
  //   },
  // });
  // console.log({ post1, post2, post3 });
}

// execute the main function
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
