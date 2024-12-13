/*
  Warnings:

  - Made the column `currentPrice` on table `Lot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lot" ALTER COLUMN "currentPrice" SET NOT NULL;
