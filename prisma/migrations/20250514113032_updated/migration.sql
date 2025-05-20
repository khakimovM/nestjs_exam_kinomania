/*
  Warnings:

  - You are about to drop the `subcription_plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_subscription" DROP CONSTRAINT "user_subscription_plan_id_fkey";

-- DropTable
DROP TABLE "subcription_plans";

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
