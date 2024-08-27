/*
  Warnings:

  - You are about to drop the column `isRead` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "isRead",
ADD COLUMN     "Status" TEXT NOT NULL DEFAULT 'sent';
