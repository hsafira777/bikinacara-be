/*
  Warnings:

  - Added the required column `eventCategory` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "bikinacara"."EventCategory" AS ENUM ('MUSIC', 'NIGHTLIFE', 'ARTS', 'HOLIDAYS', 'EDUCATION', 'HOBBIES', 'BUSINESS', 'FOOD_AND_DRINK');

-- AlterTable
ALTER TABLE "bikinacara"."events" ADD COLUMN     "eventCategory" "bikinacara"."EventCategory" NOT NULL;
