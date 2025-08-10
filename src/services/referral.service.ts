import prisma from "../lib/prisma";
import * as referralRepo from "../repositories/referral.repository";
import * as pointsRepo from "../repositories/points.repository";
import * as discountRepo from "../repositories/discount.repository";

const REFERRAL_POINT = 10000;
const REFERRAL_VALID_DAYS = 90;
const REFERRAL_DISCOUNT_PERCENTAGE = 10;

/**
 * Apply referral when a new user registers with a referralCode.
 * - create a Referral record
 * - create Point for referrer (expires in 90 days)
 * - increment referrer's pointsBalance
 * - create a Discount (10%) for the referred user, 90 days validity
 */
export const applyReferralOnRegister = async (
  referredUserId: string,
  referralCode: string
) => {
  const referrer = await referralRepo.findUserByReferralCode(referralCode);
  if (!referrer) throw new Error("Referral code not found");
  if (referrer.id === referredUserId)
    throw new Error("Cannot use your own referral code");

  return prisma.$transaction(async (tx) => {
    // create referral record
    await tx.referral.create({
      data: {
        usedById: referrer.id,
        referredUserId,
        referralCodeUsed: referralCode,
      },
    });

    // create point for referrer
    const expiresAt = new Date(
      Date.now() + REFERRAL_VALID_DAYS * 24 * 60 * 60 * 1000
    );
    await tx.point.create({
      data: {
        userId: referrer.id,
        amount: REFERRAL_POINT,
        source: "REFERRAL",
        expiresAt,
      },
    });

    // update pointsBalance
    await tx.user.update({
      where: { id: referrer.id },
      data: { pointsBalance: { increment: REFERRAL_POINT } },
    });

    // create 10% discount for the referred user (valid 90 days)
    const discountExpiry = expiresAt;
    const discount = await tx.discount.create({
      data: {
        userId: referredUserId,
        percentage: REFERRAL_DISCOUNT_PERCENTAGE,
        expiredAt: discountExpiry,
      },
    });

    // mark user as referred (set referredById)
    await tx.user.update({
      where: { id: referredUserId },
      data: { referredById: referrer.id },
    });

    return { success: true, discount };
  });
};
