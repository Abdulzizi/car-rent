/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nama_admin" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "nopol" TEXT NOT NULL,
    "merk_mobil" TEXT NOT NULL DEFAULT '',
    "harga_perhari" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL DEFAULT 0,
    "nama_penyewa" TEXT NOT NULL DEFAULT '',
    "tgl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lama_sewa" INTEGER NOT NULL DEFAULT 0,
    "total_bayar" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Car_nopol_key" ON "Car"("nopol");

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
