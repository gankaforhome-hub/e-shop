-- "//host" is a protocol-relative link to another site, not an internal path: an internal
-- path is "/" followed by anything but a second slash
ALTER TABLE "banners" DROP CONSTRAINT "banners_url_check";
ALTER TABLE "banners" ADD CONSTRAINT "banners_url_check" CHECK ("url" IS NULL OR "url" ~ '^(/([^/]|$)|https?://)');
