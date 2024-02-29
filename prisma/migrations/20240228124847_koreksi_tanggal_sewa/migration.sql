/*
  Warnings:

  - The `tgl` column on the `Rent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Rent" DROP COLUMN "tgl",
ADD COLUMN     "tgl" INTEGER NOT NULL DEFAULT 0;
