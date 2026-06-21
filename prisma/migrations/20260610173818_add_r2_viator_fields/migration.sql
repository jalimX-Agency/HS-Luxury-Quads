-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "imageKey" TEXT;

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "imageKeys" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "viatorUrl" TEXT,
ADD COLUMN     "whatsappMsg" TEXT;
