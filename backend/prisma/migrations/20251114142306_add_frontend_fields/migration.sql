-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "category" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "requirements" TEXT;
