/*
  Warnings:

  - You are about to drop the column `duration_minutes` on the `movies` table. All the data in the column will be lost.
  - Added the required column `duration_minute` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "duration_minutes",
ADD COLUMN     "duration_minute" INTEGER NOT NULL;
