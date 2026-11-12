-- Customer contacts: optional phone (E.164) and the id of a linked Google account.
-- Additive and nullable, so existing rows stay valid.
ALTER TABLE "users"
  ADD COLUMN "phone" VARCHAR(20),
  ADD COLUMN "phone_verified_at" TIMESTAMPTZ,
  ADD COLUMN "google_sub" VARCHAR(255);

CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
CREATE UNIQUE INDEX "users_google_sub_key" ON "users"("google_sub");
