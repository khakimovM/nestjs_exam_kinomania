-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'complated',
ALTER COLUMN "external_transaction_id" DROP NOT NULL;
