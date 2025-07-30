-- CreateEnum
CREATE TYPE "bikinacara"."Role" AS ENUM ('ATTENDEE', 'ORGANIZER');

-- CreateTable
CREATE TABLE "bikinacara"."users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePic" TEXT,
    "role" "bikinacara"."Role" NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referredById" UUID,
    "pointsBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "bikinacara"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "bikinacara"."users"("referralCode");

-- AddForeignKey
ALTER TABLE "bikinacara"."users" ADD CONSTRAINT "users_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "bikinacara"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
