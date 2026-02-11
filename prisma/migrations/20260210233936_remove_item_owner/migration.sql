/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_ownerId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "ownerId";
