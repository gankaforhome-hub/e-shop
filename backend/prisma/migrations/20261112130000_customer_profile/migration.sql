-- Customer profile and consents. Additive and nullable, so existing rows stay valid.
ALTER TABLE "users"
  ADD COLUMN "first_name" VARCHAR(100),
  ADD COLUMN "last_name" VARCHAR(100),
  ADD COLUMN "terms_accepted_at" TIMESTAMPTZ,
  ADD COLUMN "terms_version" VARCHAR(32),
  ADD COLUMN "marketing_consent_at" TIMESTAMPTZ;
