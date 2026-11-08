-- CreateEnum
CREATE TYPE "locale" AS ENUM ('uk', 'en');

-- CreateTable
CREATE TABLE "seasons" (
    "slug" VARCHAR(50) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "season_translations" (
    "season_slug" VARCHAR(50) NOT NULL,
    "language_code" "locale" NOT NULL,
    "label" VARCHAR(50) NOT NULL,

    CONSTRAINT "season_translations_pkey" PRIMARY KEY ("season_slug","language_code")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "sku_prefix" VARCHAR(8),
    "season_slug" VARCHAR(50),
    "cover_image_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_translations" (
    "collection_id" TEXT NOT NULL,
    "language_code" "locale" NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "short_description" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "meta_title" VARCHAR(120),
    "meta_description" VARCHAR(320),

    CONSTRAINT "collection_translations_pkey" PRIMARY KEY ("collection_id","language_code")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "variants" JSONB NOT NULL,
    "blur_data_url" TEXT,
    "alt" VARCHAR(250),
    "original_name" VARCHAR(255),
    "focal_x" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "focal_y" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "crop_data" JSONB,
    "uploaded_by_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collections_sku_prefix_key" ON "collections"("sku_prefix");

-- CreateIndex
CREATE INDEX "collections_is_active_sort_order_idx" ON "collections"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "media_checksum_key" ON "media"("checksum");

-- AddForeignKey
ALTER TABLE "season_translations" ADD CONSTRAINT "season_translations_season_slug_fkey" FOREIGN KEY ("season_slug") REFERENCES "seasons"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_season_slug_fkey" FOREIGN KEY ("season_slug") REFERENCES "seasons"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_translations" ADD CONSTRAINT "collection_translations_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Slug formats: seasons allow '_' (new_year), collections are kebab-case
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_slug_check" CHECK ("slug" ~ '^[a-z0-9]+([_-][a-z0-9]+)*$');
ALTER TABLE "collections" ADD CONSTRAINT "collections_slug_check" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

-- Focal point as fractions of the image
ALTER TABLE "media" ADD CONSTRAINT "media_focal_x_check" CHECK ("focal_x" BETWEEN 0 AND 1);
ALTER TABLE "media" ADD CONSTRAINT "media_focal_y_check" CHECK ("focal_y" BETWEEN 0 AND 1);

-- RLS without policies: the Supabase Data API sees no rows; the backend connects as the owner
ALTER TABLE "seasons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "season_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "collections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "collection_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
