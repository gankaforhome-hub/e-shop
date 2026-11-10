-- Collection SKU prefixes become two digits, assigned by the database in creation order
-- (01, 02, …). A sequence never hands out a number twice, so a deleted collection's code is
-- not reused on printed labels. 99 is the limit: nextval fails after it.
CREATE SEQUENCE "collection_sku_prefix_seq" AS INTEGER MINVALUE 1 MAXVALUE 99 NO CYCLE;

-- Existing collections get their codes in creation order (seeded rows share a timestamp,
-- so the list order breaks ties)
WITH "numbered" AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "created_at", "sort_order", "slug") AS "n"
  FROM "collections"
)
UPDATE "collections" AS "c"
SET "sku_prefix" = LPAD("numbered"."n"::TEXT, 2, '0')
FROM "numbered"
WHERE "c"."id" = "numbered"."id";

-- The next new collection continues after the existing ones
SELECT setval(
  '"collection_sku_prefix_seq"',
  GREATEST((SELECT COUNT(*) FROM "collections"), 1),
  (SELECT COUNT(*) FROM "collections") > 0
);

-- AlterTable
ALTER TABLE "collections"
  ALTER COLUMN "sku_prefix" SET DATA TYPE VARCHAR(2),
  ALTER COLUMN "sku_prefix" SET DEFAULT lpad((nextval('collection_sku_prefix_seq'::regclass))::text, 2, '0'::text),
  ALTER COLUMN "sku_prefix" SET NOT NULL;

ALTER SEQUENCE "collection_sku_prefix_seq" OWNED BY "collections"."sku_prefix";

-- Two digits only
ALTER TABLE "collections" ADD CONSTRAINT "collections_sku_prefix_check" CHECK ("sku_prefix" ~ '^[0-9]{2}$');
