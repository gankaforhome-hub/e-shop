import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    // CLI connection (migrations, Studio). Migrations can't run through a
    // transaction pooler, so Supabase sets DIRECT_URL; locally DATABASE_URL is enough.
    // process.env instead of env(): `prisma generate` must work without any URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
