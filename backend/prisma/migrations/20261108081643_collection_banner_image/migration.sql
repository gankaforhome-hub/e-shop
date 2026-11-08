-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "banner_image_id" TEXT;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_banner_image_id_fkey" FOREIGN KEY ("banner_image_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
