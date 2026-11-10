-- Collection SKU prefixes grow to three digits (001-999): there may be up to a thousand
-- collections. Existing codes keep their number (01 → 001); the sequence goes on from where it is.
ALTER TABLE "collections" DROP CONSTRAINT "collections_sku_prefix_check";

ALTER TABLE "collections"
  ALTER COLUMN "sku_prefix" DROP DEFAULT,
  ALTER COLUMN "sku_prefix" SET DATA TYPE VARCHAR(3);

UPDATE "collections" SET "sku_prefix" = LPAD("sku_prefix", 3, '0');

ALTER SEQUENCE "collection_sku_prefix_seq" MAXVALUE 999;

ALTER TABLE "collections"
  ALTER COLUMN "sku_prefix" SET DEFAULT lpad((nextval('collection_sku_prefix_seq'::regclass))::text, 3, '0'::text);

-- Three digits only
ALTER TABLE "collections" ADD CONSTRAINT "collections_sku_prefix_check" CHECK ("sku_prefix" ~ '^[0-9]{3}$');
