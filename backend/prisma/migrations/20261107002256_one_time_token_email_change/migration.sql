-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "one_time_token_purpose" ADD VALUE 'EMAIL_CHANGE_OLD';
ALTER TYPE "one_time_token_purpose" ADD VALUE 'EMAIL_CHANGE_NEW';

-- AlterTable
ALTER TABLE "one_time_tokens" ADD COLUMN     "new_email" VARCHAR;

