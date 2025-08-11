import prisma from "../lib/prisma";
import * as referralRepo from "../repositories/referral.repository";


const REFERRAL_POINT = 10000;
const REFERRAL_VALID_DAYS = 90;
const REFERRAL_DISCOUNT_PERCENTAGE = 10;


export const applyReferralOnRegister = async (
  referredUserId: string,
  referralCode: string
) => {
  const referrer = await referralRepo.findUserByReferralCode(referralCode);
  if (!referrer) throw new Error("Referral code not found");
  if (referrer.id === referredUserId)
    throw new Error("Cannot use your own referral code");

  return prisma.$transaction(async (tx) => {
   
    await tx.referral.create({
      data: {
        usedById: referrer.id,
        referredUserId,
        referralCodeUsed: referralCode,
      },
    });

    
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

    
    await tx.user.update({
      where: { id: referrer.id },
      data: { pointsBalance: { increment: REFERRAL_POINT } },
    });


    const discountExpiry = expiresAt;
    const discount = await tx.discount.create({
      data: {
        userId: referredUserId,
        percentage: REFERRAL_DISCOUNT_PERCENTAGE,
        expiredAt: discountExpiry,
      },
    });

    await tx.user.update({
      where: { id: referredUserId },
      data: { referredById: referrer.id },
    });

    return { success: true, discount };
  });
};
