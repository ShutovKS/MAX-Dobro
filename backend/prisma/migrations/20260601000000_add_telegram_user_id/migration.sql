-- AlterTable
ALTER TABLE "users" ADD COLUMN "telegram_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_user_id_key" ON "users"("telegram_user_id");
