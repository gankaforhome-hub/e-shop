-- P1: separate identity systems for staff (CMS) and customers (storefront).
-- See .claude/docs/backend/database-design.md §2, §3, §8. Hand-written order: create, copy, rename, drop.

-- CreateEnum
CREATE TYPE "staff_token_purpose" AS ENUM ('INVITE', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "customer_token_purpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE_OLD', 'EMAIL_CHANGE_NEW');

-- CreateEnum
CREATE TYPE "identity_provider" AS ENUM ('GOOGLE');

-- CreateEnum
CREATE TYPE "consent_type" AS ENUM ('TERMS', 'PRIVACY', 'MARKETING_EMAIL', 'MARKETING_SMS');

-- CreateEnum
CREATE TYPE "consent_source" AS ENUM ('SIGN_UP', 'GOOGLE', 'ACCOUNT', 'CHECKOUT', 'UNSUBSCRIBE_LINK', 'MIGRATION');

-- CreateTable
CREATE TABLE "staff_users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR,
    "name" VARCHAR(100),
    "role" "staff_role" NOT NULL,
    "email_verified_at" TIMESTAMPTZ,
    "revoked_at" TIMESTAMPTZ,
    "invited_by_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_sessions" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "aal" INTEGER NOT NULL DEFAULT 1,
    "credential_id" TEXT,
    "expires" TIMESTAMPTZ NOT NULL,
    "rotated_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" TEXT,
    "staff_user_id" TEXT NOT NULL,

    CONSTRAINT "staff_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_tokens" (
    "hash" TEXT NOT NULL,
    "purpose" "staff_token_purpose" NOT NULL,
    "expires" TIMESTAMPTZ NOT NULL,
    "consumed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staff_user_id" TEXT NOT NULL,

    CONSTRAINT "staff_tokens_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "email_verified_at" TIMESTAMPTZ,
    "phone_verified_at" TIMESTAMPTZ,
    "locale" "locale" NOT NULL DEFAULT 'uk',
    "marketing_email" BOOLEAN NOT NULL DEFAULT false,
    "marketing_sms" BOOLEAN NOT NULL DEFAULT false,
    "anonymized_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_identities" (
    "id" TEXT NOT NULL,
    "provider" "identity_provider" NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "customer_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_sessions" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "aal" INTEGER NOT NULL DEFAULT 1,
    "credential_id" TEXT,
    "expires" TIMESTAMPTZ NOT NULL,
    "rotated_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" TEXT,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "customer_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_tokens" (
    "hash" TEXT NOT NULL,
    "purpose" "customer_token_purpose" NOT NULL,
    "new_email" VARCHAR,
    "expires" TIMESTAMPTZ NOT NULL,
    "consumed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "customer_tokens_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "customer_consents" (
    "id" TEXT NOT NULL,
    "type" "consent_type" NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "version" VARCHAR(32),
    "source" "consent_source" NOT NULL,
    "ip" VARCHAR(64),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "customer_consents_pkey" PRIMARY KEY ("id")
);

-- ─── Copy the data (ids kept, so ROOT_USER_IDS, audit logs and keys stay valid) ───

-- Staff: users with a staff account
INSERT INTO "staff_users" ("id", "email", "password", "name", "role", "email_verified_at", "revoked_at", "created_at", "updated_at")
SELECT u."id", u."email", u."password", u."name", s."role", u."email_verified_at", s."revoked_at", u."created_at", u."updated_at"
FROM "users" u JOIN "staff_accounts" s ON s."user_id" = u."id";

-- Pending staff links (invitations, password resets)
INSERT INTO "staff_tokens" ("hash", "purpose", "expires", "consumed_at", "created_at", "staff_user_id")
SELECT t."hash",
       (CASE t."purpose" WHEN 'STAFF_INVITE' THEN 'INVITE' ELSE 'PASSWORD_RESET' END)::"staff_token_purpose",
       t."expires", t."consumed_at", t."created_at", t."user_id"
FROM "one_time_tokens" t JOIN "staff_accounts" s ON s."user_id" = t."user_id"
WHERE t."purpose" IN ('STAFF_INVITE', 'PASSWORD_RESET') AND t."consumed_at" IS NULL;

-- Customers: everyone else
INSERT INTO "customers" ("id", "email", "password", "first_name", "last_name", "phone", "email_verified_at", "phone_verified_at", "marketing_email", "created_at", "updated_at")
SELECT u."id", u."email", u."password", u."first_name", u."last_name", u."phone", u."email_verified_at", u."phone_verified_at",
       u."marketing_consent_at" IS NOT NULL, u."created_at", u."updated_at"
FROM "users" u
WHERE NOT EXISTS (SELECT 1 FROM "staff_accounts" s WHERE s."user_id" = u."id");

INSERT INTO "customer_identities" ("id", "provider", "provider_user_id", "email", "created_at", "customer_id")
SELECT gen_random_uuid()::text, 'GOOGLE', u."google_sub", u."email", u."updated_at", u."id"
FROM "users" u JOIN "customers" c ON c."id" = u."id"
WHERE u."google_sub" IS NOT NULL;

-- The consent columns become journal rows
INSERT INTO "customer_consents" ("id", "type", "granted", "version", "source", "created_at", "customer_id")
SELECT gen_random_uuid()::text, k."type"::"consent_type", true, u."terms_version", 'MIGRATION', u."terms_accepted_at", u."id"
FROM "users" u JOIN "customers" c ON c."id" = u."id"
CROSS JOIN (VALUES ('TERMS'), ('PRIVACY')) AS k("type")
WHERE u."terms_accepted_at" IS NOT NULL;

INSERT INTO "customer_consents" ("id", "type", "granted", "source", "created_at", "customer_id")
SELECT gen_random_uuid()::text, 'MARKETING_EMAIL', true, 'MIGRATION', u."marketing_consent_at", u."id"
FROM "users" u JOIN "customers" c ON c."id" = u."id"
WHERE u."marketing_consent_at" IS NOT NULL;

-- Pending customer links
INSERT INTO "customer_tokens" ("hash", "purpose", "new_email", "expires", "consumed_at", "created_at", "customer_id")
SELECT t."hash", t."purpose"::text::"customer_token_purpose", t."new_email", t."expires", t."consumed_at", t."created_at", t."user_id"
FROM "one_time_tokens" t JOIN "customers" c ON c."id" = t."user_id"
WHERE t."purpose" IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE_OLD', 'EMAIL_CHANGE_NEW');

-- Sessions are not copied: everyone signs in again.

-- ─── Keys move to staff_users (rename, never drop: the keys must survive) ───
ALTER TABLE "webauthn_credentials" DROP CONSTRAINT "webauthn_credentials_user_id_fkey";
ALTER TABLE "webauthn_challenges" DROP CONSTRAINT "webauthn_challenges_user_id_fkey";
DROP INDEX "webauthn_credentials_user_id_idx";
DROP INDEX "webauthn_challenges_user_id_idx";
DELETE FROM "webauthn_credentials" w WHERE NOT EXISTS (SELECT 1 FROM "staff_users" s WHERE s."id" = w."user_id");
DELETE FROM "webauthn_challenges" w WHERE NOT EXISTS (SELECT 1 FROM "staff_users" s WHERE s."id" = w."user_id");
ALTER TABLE "webauthn_credentials" RENAME COLUMN "user_id" TO "staff_user_id";
ALTER TABLE "webauthn_challenges" RENAME COLUMN "user_id" TO "staff_user_id";

-- ─── The shared tables go ───
DROP TABLE "tokens";
DROP TABLE "one_time_tokens";
DROP TABLE "staff_accounts";
DROP TABLE "users";
DROP TYPE "one_time_token_purpose";

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_email_key" ON "staff_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_sessions_token_key" ON "staff_sessions"("token");

-- CreateIndex
CREATE INDEX "staff_sessions_staff_user_id_idx" ON "staff_sessions"("staff_user_id");

-- CreateIndex
CREATE INDEX "staff_sessions_family_id_idx" ON "staff_sessions"("family_id");

-- CreateIndex
CREATE INDEX "staff_tokens_staff_user_id_idx" ON "staff_tokens"("staff_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "customer_identities_customer_id_idx" ON "customer_identities"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_identities_provider_provider_user_id_key" ON "customer_identities"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_sessions_token_key" ON "customer_sessions"("token");

-- CreateIndex
CREATE INDEX "customer_sessions_customer_id_idx" ON "customer_sessions"("customer_id");

-- CreateIndex
CREATE INDEX "customer_sessions_family_id_idx" ON "customer_sessions"("family_id");

-- CreateIndex
CREATE INDEX "customer_tokens_customer_id_idx" ON "customer_tokens"("customer_id");

-- CreateIndex
CREATE INDEX "customer_consents_customer_id_type_created_at_idx" ON "customer_consents"("customer_id", "type", "created_at");

-- CreateIndex
CREATE INDEX "webauthn_credentials_staff_user_id_idx" ON "webauthn_credentials"("staff_user_id");

-- CreateIndex
CREATE INDEX "webauthn_challenges_staff_user_id_idx" ON "webauthn_challenges"("staff_user_id");

-- AddForeignKey
ALTER TABLE "staff_sessions" ADD CONSTRAINT "staff_sessions_staff_user_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_tokens" ADD CONSTRAINT "staff_tokens_staff_user_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webauthn_credentials" ADD CONSTRAINT "webauthn_credentials_staff_user_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webauthn_challenges" ADD CONSTRAINT "webauthn_challenges_staff_user_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_identities" ADD CONSTRAINT "customer_identities_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_sessions" ADD CONSTRAINT "customer_sessions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_tokens" ADD CONSTRAINT "customer_tokens_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_consents" ADD CONSTRAINT "customer_consents_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
