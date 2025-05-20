-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_categories" DROP CONSTRAINT "movie_categories_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_files" DROP CONSTRAINT "movie_files_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "watch_history" DROP CONSTRAINT "watch_history_movie_id_fkey";

-- AddForeignKey
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_files" ADD CONSTRAINT "movie_files_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
