-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN     "payload" JSONB,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';
