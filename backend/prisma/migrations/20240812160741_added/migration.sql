/*
  Warnings:

  - You are about to drop the column `UserId` on the `GroupMessages` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `GroupMessages` table. All the data in the column will be lost.
  - Added the required column `profile` to the `GroupChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupChat" ADD COLUMN     "profile" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GroupMessages" DROP COLUMN "UserId",
DROP COLUMN "messageId";
