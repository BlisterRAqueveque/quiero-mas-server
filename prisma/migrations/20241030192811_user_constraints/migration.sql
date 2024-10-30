/*
  Warnings:

  - You are about to drop the column `area` on the `Property` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "area";
