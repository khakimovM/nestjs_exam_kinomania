-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'superadmin', 'user');

-- CreateEnum
CREATE TYPE "SubStatus" AS ENUM ('active', 'expired', 'canceled', 'pending_payment');

-- CreateEnum
CREATE TYPE "Payment_method" AS ENUM ('card', 'paypal', 'bank_transfer', 'crypto');

-- CreateEnum
CREATE TYPE "Payment_status" AS ENUM ('pending', 'complated', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "Subscription_type" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "Quality" AS ENUM ('240p', '360p', '480p', '720p', '1080p', '4K');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "avatar_url" VARCHAR(255),
    "full_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "country" VARCHAR(50),
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcription_plans" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subcription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subcription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "SubStatus" NOT NULL DEFAULT 'pending_payment',
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_subcription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "user_subcription_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "Payment_method" NOT NULL,
    "payment_details" JSONB NOT NULL,
    "status" "Payment_status" NOT NULL,
    "external_transaction_id" VARCHAR(100) NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "release_year" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "poster_url" VARCHAR(255) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "subscription_type" "Subscription_type" NOT NULL DEFAULT 'free',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_categories" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "movie_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_files" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "file_url" VARCHAR(100) NOT NULL,
    "qualit" "Quality" NOT NULL,
    "language" VARCHAR(20) NOT NULL DEFAULT 'uz',

    CONSTRAINT "movie_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watch_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "watched_duration" INTEGER NOT NULL,
    "watched_percentage" DOUBLE PRECISION NOT NULL,
    "last_watched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "movies_slug_key" ON "movies"("slug");

-- AddForeignKey
ALTER TABLE "user_subcription" ADD CONSTRAINT "user_subcription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subcription" ADD CONSTRAINT "user_subcription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subcription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_subcription_id_fkey" FOREIGN KEY ("user_subcription_id") REFERENCES "user_subcription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_files" ADD CONSTRAINT "movie_files_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
