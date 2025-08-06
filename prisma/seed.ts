import { PrismaClient } from "@prisma/client";
import { createTransaction } from "../src/services/transaction.service"; // sesuaikan path-nya
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // 1. Buat user
  const user = await prisma.user.create({
    data: {
      id: uuid(),
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "hashedpassword",
      role: "ATTENDEE",
    },
  });

  // 2. Buat organizer
  const organizer = await prisma.user.create({
    data: {
      id: uuid(),
      name: "Organizer Keren",
      email: "organizerkeren@example.com",
      password: "hashedpassword",
      role: "ORGANIZER",
    },
  });

  // 3. Buat event
  const event = await prisma.event.create({
    data: {
      id: uuid(),
      title: "Music Fest",
      description: "Biggest music event",
      date: new Date("2025-09-01"),
      time: new Date("1970-01-01T20:00:00.000Z"),
      location: "Jakarta",
      eventCategory: "MUSIC",
      eventType: "PAID",
      totalSeats: 1000,
      organizerId: organizer.id,
    },
  });

  // 4. Buat ticketType
  const ticketType = await prisma.ticketType.create({
    data: {
      id: uuid(),
      eventId: event.id,
      name: "General Admission",
      price: 50000,
      quota: 100,
    },
  });

  // 5. Tambahkan point user
  await prisma.point.createMany({
    data: [
      {
        id: uuid(),
        userId: user.id,
        amount: 10000,
        source: "REFERRAL",
        expiresAt: dayjs().add(30, "days").toDate(),
        redeemed: false,
      },
      {
        id: uuid(),
        userId: user.id,
        amount: 5000,
        source: "REDEMPTION",
        expiresAt: dayjs().add(60, "days").toDate(),
        redeemed: false,
      },
    ],
  });

  // 6. Buat referral user (jika ingin test diskon referral)
  const referrer = await prisma.user.create({
    data: {
      id: uuid(),
      name: "Referrer",
      email: "referrer@example.com",
      password: "hashedpassword",
      role: "ATTENDEE",
    },
  });

  await prisma.referral.create({
    data: {
      id: uuid(),
      usedById: referrer.id,
      referredUserId: user.id,
      referralCodeUsed: "REF123",
      createdAt: dayjs().subtract(1, "month").toDate(), // masih aktif (≤ 3 bulan)
    },
  });

  // 7. Panggil service untuk buat transaksi
  const transaction = await createTransaction({
    userId: user.id,
    eventId: event.id,
    ticketTypeId: ticketType.id,
    quantity: 2,
    usePoints: true,
  });

  console.log("Transaction created:", transaction.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
