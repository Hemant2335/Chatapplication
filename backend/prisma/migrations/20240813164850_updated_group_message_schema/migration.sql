/*
  Warnings:

  - Added the required column `fromUser` to the `GroupMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupMessages" ADD COLUMN     "fromUser" TEXT NOT NULL;
