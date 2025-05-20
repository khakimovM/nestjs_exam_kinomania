/*
  Warnings:

  - You are about to drop the `user_subcription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_user_subcription_id_fkey";

-- DropForeignKey
ALTER TABLE "user_subcription" DROP CONSTRAINT "user_subcription_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "user_subcription" DROP CONSTRAINT "user_subcription_user_id_fkey";

-- DropTable
DROP TABLE "user_subcription";

-- CreateTable
CREATE TABLE "user_subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "SubStatus" NOT NULL DEFAULT 'pending_payment',
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subcription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_subcription_id_fkey" FOREIGN KEY ("user_subcription_id") REFERENCES "user_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
