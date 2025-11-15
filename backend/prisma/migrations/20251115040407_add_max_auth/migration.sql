/*
  Warnings:

  - A unique constraint covering the columns `[max_user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "max_user_id" TEXT,
ALTER COLUMN "supabase_user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_max_user_id_key" ON "users"("max_user_id");
