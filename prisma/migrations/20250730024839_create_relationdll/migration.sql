/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "bikinacara"."PromoType" AS ENUM ('VOUCHER', 'REFERRAL', 'POINTS_REDEMPTION');

-- CreateEnum
CREATE TYPE "bikinacara"."PromoValueType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "bikinacara"."users" ADD COLUMN     "pointsBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredById" UUID;

-- CreateTable
CREATE TABLE "bikinacara"."Promotion" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "type" "bikinacara"."PromoType" NOT NULL,
    "value" INTEGER NOT NULL,
    "valueType" "bikinacara"."PromoValueType" NOT NULL,
    "usageLimit" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "voucherCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "bikinacara"."users"("referralCode");

-- AddForeignKey
ALTER TABLE "bikinacara"."users" ADD CONSTRAINT "users_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "bikinacara"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "bikinacara"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."ticket_types" ADD CONSTRAINT "ticket_types_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "bikinacara"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."ticket_purchases" ADD CONSTRAINT "ticket_purchases_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "bikinacara"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."ticket_purchases" ADD CONSTRAINT "ticket_purchases_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "bikinacara"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."ticket_purchases" ADD CONSTRAINT "ticket_purchases_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "bikinacara"."ticket_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "bikinacara"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."transactions" ADD CONSTRAINT "transactions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "bikinacara"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."transaction_items" ADD CONSTRAINT "transaction_items_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "bikinacara"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."transaction_items" ADD CONSTRAINT "transaction_items_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "bikinacara"."ticket_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."Promotion" ADD CONSTRAINT "Promotion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "bikinacara"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."referrals" ADD CONSTRAINT "referrals_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "bikinacara"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."referrals" ADD CONSTRAINT "referrals_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "bikinacara"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."points" ADD CONSTRAINT "points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "bikinacara"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "bikinacara"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bikinacara"."reviews" ADD CONSTRAINT "reviews_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "bikinacara"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
