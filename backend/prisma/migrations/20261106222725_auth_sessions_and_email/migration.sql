-- Existing refresh tokens are stored in plain text and can't get the new required columns.
-- Everyone signs in again.
DELETE FROM "tokens";

-- CreateEnum
CREATE TYPE "auth_audience" AS ENUM ('STOREFRONT', 'CMS');

-- CreateEnum
CREATE TYPE "one_time_token_purpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "aal" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "audience" "auth_audience" NOT NULL DEFAULT 'STOREFRONT',
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "family_id" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "rotated_at" TIMESTAMPTZ,
ALTER COLUMN "expires" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "user_agent" DROP NOT NULL,
ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified_at" TIMESTAMPTZ,
ADD COLUMN     "name" VARCHAR(100);

-- Emails are compared in lower case; Prisma doesn't track this constraint.
UPDATE "users" SET "email" = lower("email") WHERE "email" <> lower("email");
ALTER TABLE "users" ADD CONSTRAINT "users_email_lowercase_check" CHECK ("email" = lower("email"));

-- CreateTable
CREATE TABLE "one_time_tokens" (
    "hash" TEXT NOT NULL,
    "purpose" "one_time_token_purpose" NOT NULL,
    "expires" TIMESTAMPTZ NOT NULL,
    "consumed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("hash")
);

-- CreateIndex
CREATE INDEX "one_time_tokens_user_id_idx" ON "one_time_tokens"("user_id");

-- CreateIndex
CREATE INDEX "tokens_user_id_idx" ON "tokens"("user_id");

-- CreateIndex
CREATE INDEX "tokens_family_id_idx" ON "tokens"("family_id");

-- AddForeignKey
ALTER TABLE "one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
