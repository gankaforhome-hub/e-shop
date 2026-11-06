// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient {
//   private prisma: PrismaClient = new PrismaClient();

//   async onOnModuleInit() {
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }

//deprecated in Prisma 5.0. In NestJS use  app.enableShutdownHooks() in main.ts
// async enableShutdownHooks(app: INestApplication) {
//   this.$on('beforeExit', async () => await app.close);
// }

//COMMENTS Custom method to get only the user model
// getUserModel() {
//   return this.prisma.user;
// }

// }

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    // Initialize the native pg driver pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    // Transfer the adapter to Prisma 6
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end(); // Обов'язково закриваємо пул Docker'а при зупинці
  }
}
