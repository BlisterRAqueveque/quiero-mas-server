/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `auctionDate` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN', 'SUPERUSER', 'AUCTIONEER');

-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('VENTA', 'ALQUILER', 'VENTA_ALQUILER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('DEPOSITOS', 'PARQUES_INDUSTRIALES', 'TERRENOS_INDUSTRIALES', 'OFICINAS', 'LOCALES', 'FONDOS_DE_COMERCIO', 'CAMPOS', 'UNIDADES_EN_POZO', 'TERRENOS', 'CASA', 'DEPARTAMENTO', 'PH', 'MONOAMBIENTE', 'DUPLEX', 'TRIPLEX', 'OTRO');

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "auctionDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "organizerId" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Article";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "exhibitionPlace" TEXT NOT NULL,
    "exhibitionTime" TIMESTAMP(3) NOT NULL,
    "winnerId" TEXT,
    "photos" TEXT[],
    "videos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "services" TEXT,
    "amenities" TEXT,
    "floors" TEXT,
    "constructed_area" DOUBLE PRECISION,
    "unbuilt_surface" DOUBLE PRECISION,
    "total_suface" DOUBLE PRECISION,
    "years" INTEGER,
    "contact" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "operation" "Operation" NOT NULL,
    "rooms" INTEGER,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" DOUBLE PRECISION,
    "photos" TEXT[],
    "videos" TEXT[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
