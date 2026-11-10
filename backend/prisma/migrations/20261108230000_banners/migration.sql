-- Home hero slides become their own entity: a slide links to a collection or to any URL
-- (promotions, blog), has its own image, texts, order and an optional schedule. The banner
-- columns of collections move here and are dropped.

-- CreateEnum
CREATE TYPE "banner_link_type" AS ENUM ('COLLECTION', 'URL');

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "link_type" "banner_link_type" NOT NULL,
    "collection_id" TEXT,
    "url" VARCHAR(500),
    "image_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_translations" (
    "banner_id" TEXT NOT NULL,
    "language_code" "locale" NOT NULL,
    "title" VARCHAR(150),
    "subtitle" VARCHAR(80),
    "cta_label" VARCHAR(40),

    CONSTRAINT "banner_translations_pkey" PRIMARY KEY ("banner_id","language_code")
);

-- CreateIndex
CREATE INDEX "banners_is_active_sort_order_idx" ON "banners"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "banners_collection_id_idx" ON "banners"("collection_id");

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_translations" ADD CONSTRAINT "banner_translations_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- The link matches its type: a collection link has a collection and no URL, and the reverse
ALTER TABLE "banners" ADD CONSTRAINT "banners_link_check" CHECK (
  ("link_type" = 'COLLECTION' AND "collection_id" IS NOT NULL AND "url" IS NULL)
  OR ("link_type" = 'URL' AND "url" IS NOT NULL AND "collection_id" IS NULL)
);

-- An internal path or an http(s) link, nothing else (no javascript: and the like)
ALTER TABLE "banners" ADD CONSTRAINT "banners_url_check" CHECK ("url" IS NULL OR "url" ~ '^(/|https?://)');

-- A schedule ends after it starts
ALTER TABLE "banners" ADD CONSTRAINT "banners_schedule_check" CHECK ("starts_at" IS NULL OR "ends_at" IS NULL OR "ends_at" > "starts_at");

-- Existing hero slides become banners in their hero order, titled by their collection
INSERT INTO "banners" ("id", "link_type", "collection_id", "image_id", "is_active", "sort_order", "updated_at")
SELECT
  gen_random_uuid()::TEXT,
  'COLLECTION',
  "id",
  "banner_image_id",
  true,
  ROW_NUMBER() OVER (ORDER BY "banner_sort_order", "sort_order", "slug"),
  CURRENT_TIMESTAMP
FROM "collections"
WHERE "in_banner" AND "banner_image_id" IS NOT NULL;

-- Their subtitles move with them
INSERT INTO "banner_translations" ("banner_id", "language_code", "subtitle")
SELECT "b"."id", "ct"."language_code", "ct"."banner_subtitle"
FROM "banners" AS "b"
JOIN "collection_translations" AS "ct" ON "ct"."collection_id" = "b"."collection_id"
WHERE "ct"."banner_subtitle" IS NOT NULL;

-- DropConstraint
ALTER TABLE "collections" DROP CONSTRAINT "collections_in_banner_check";

-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_banner_image_id_fkey";

-- AlterTable
ALTER TABLE "collection_translations" DROP COLUMN "banner_subtitle";

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "banner_image_id",
DROP COLUMN "banner_sort_order",
DROP COLUMN "in_banner";
