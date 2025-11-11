-- AlterTable
ALTER TABLE "events" ADD COLUMN     "durationHours" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PLANNED';
