-- AlterTable
ALTER TABLE "collection_translations" ADD COLUMN     "banner_subtitle" VARCHAR(80);

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "banner_sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "in_banner" BOOLEAN NOT NULL DEFAULT false;

-- A collection can be in the hero only with a banner image
ALTER TABLE "collections" ADD CONSTRAINT "collections_in_banner_check" CHECK (NOT "in_banner" OR "banner_image_id" IS NOT NULL);
