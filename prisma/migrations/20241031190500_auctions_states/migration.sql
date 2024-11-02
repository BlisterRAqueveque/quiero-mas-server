/*
  Warnings:

  - You are about to drop the column `available` on the `Auction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('AVAILABLE', 'WAITING', 'CLOSED');

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "available",
ADD COLUMN     "state" "State" NOT NULL DEFAULT 'AVAILABLE';
