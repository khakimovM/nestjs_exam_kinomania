/*
  Warnings:

  - You are about to drop the column `qualit` on the `movie_files` table. All the data in the column will be lost.
  - Added the required column `quality` to the `movie_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie_files" DROP COLUMN "qualit",
ADD COLUMN     "quality" "Quality" NOT NULL;
