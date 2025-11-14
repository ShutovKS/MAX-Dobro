-- AlterTable
ALTER TABLE "events" ADD COLUMN     "recommendedCourseId" INTEGER;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "fullDescription" TEXT;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_recommendedCourseId_fkey" FOREIGN KEY ("recommendedCourseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
