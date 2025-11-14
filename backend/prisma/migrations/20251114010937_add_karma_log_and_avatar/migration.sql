-- CreateTable
CREATE TABLE "karma_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "karma_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "karma_logs_createdAt_idx" ON "karma_logs"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "User_karmaPoints_idx" ON "User"("karmaPoints" DESC);

-- AddForeignKey
ALTER TABLE "karma_logs" ADD CONSTRAINT "karma_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
