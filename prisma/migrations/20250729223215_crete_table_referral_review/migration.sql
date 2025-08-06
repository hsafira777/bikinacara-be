-- CreateEnum
CREATE TYPE "bikinacara"."PointSource" AS ENUM ('REFERRAL', 'REDEMPTION');

-- CreateTable
CREATE TABLE "bikinacara"."referrals" (
    "id" UUID NOT NULL,
    "usedById" UUID NOT NULL,
    "referredUserId" UUID NOT NULL,
    "referralCodeUsed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bikinacara"."points" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" "bikinacara"."PointSource" NOT NULL,
    "usedInTransactionId" UUID,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bikinacara"."reviews" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
