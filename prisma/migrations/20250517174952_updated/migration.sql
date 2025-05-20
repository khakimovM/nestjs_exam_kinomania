/*
  Warnings:

  - Made the column `rating` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0;
