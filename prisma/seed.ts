<<<<<<< HEAD

// // import { PrismaClient } from "@prisma/client";
// // import { addDays, setHours, setMinutes } from "date-fns";

// // File: prisma/seed.ts
// import { PrismaClient } from "@prisma/client";
// import dayjs from "dayjs";
// import { v4 as uuid } from "uuid";
// import { faker } from "@faker-js/faker";

// // const prisma = new PrismaClient();

// // async function main() {
// //   // ✅ Coba cari user yang sudah ada
// //   const organizer = await prisma.user.findFirst({
// //     where: {
// //       email: "organizer555@example.com", // ganti sesuai email user yang sudah ada
// //       role: "ORGANIZER",
// //     },
// //   });
=======
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

async function main() {
  const users = [];
  const organizers = [];
>>>>>>> 882eb577b23cedf21152309763461d6816e7ab66

// //   if (!organizer) {
// //     throw new Error("Organizer tidak ditemukan. Buat user terlebih dahulu.");
// //   }

// //   const events = [
// //     {
// //       title: "Indie Folk Festival",
// //       description: "The best indie festival this year!",
// //       dateOffset: 1,
// //       time: "18:30",
// //       location: "Lapangan Sabuga Bandung",
// //       image: "/images/event1.jpg",
// //       eventCategory: "MUSIC",
// //       eventType: "PAID",
// //     },
// //     {
// //       title: "Lantern Festival",
// //       description: "Feel the serenity and peace of the Lantern Festival.",
// //       dateOffset: 2,
// //       time: "22:00",
// //       location: "Candi Borobudur Magelang",
// //       image: "/images/event2.jpg",
// //       eventCategory: "HOLIDAYS",
// //       eventType: "FREE",
// //     },
// //     {
// //       title: "Drone Racing Championship",
// //       description: "Get your drones out, it's time for some racing!",
// //       dateOffset: 3,
// //       time: "22:00",
// //       location: "Stadion GBK Jakarta",
// //       image: "/images/event3.jpg",
// //       eventCategory: "HOBBIES",
// //       eventType: "FREE",
// //     },
// //   ];

// //   for (const [index, event] of events.entries()) {
// //     const [hour, minute] = event.time.split(":").map(Number);
// //     const date = setMinutes(
// //       setHours(addDays(new Date(), event.dateOffset), hour),
// //       minute
// //     );

// //     await prisma.event.create({
// //       data: {
// //         organizerId: organizer.id,
// //         title: event.title,
// //         description: event.description,
// //         date,
// //         time: date,
// //         location: event.location,
// //         image: event.image,
// //         eventCategory: event.eventCategory as any,
// //         eventType: event.eventType as any,
// //         totalSeats: 100 + index * 5,
// //       },
// //     });
// //   }

// //   console.log("✅ Berhasil seed event tanpa membuat user baru.");
// // }

<<<<<<< HEAD
// // main()
// //   .catch((e) => {
// //     console.error("❌ Gagal saat seeding:", e);
// //   })
// //   .finally(async () => {
// //     await prisma.$disconnect();
// //   });
=======
    const ticketType = await prisma.ticketType.create({
      data: {
        id: uuid(),
        eventId: event.id,
        name: "General",
        price: faker.number.int({ min: 20000, max: 100000 }),
        quota: faker.number.int({ min: 10, max: 200 }),
      },
    });

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

    const referrer = await prisma.user.create({
      data: {
        id: uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "ATTENDEE",
      },
    });

    await prisma.referral.create({
      data: {
        id: uuid(),
        usedById: referrer.id,
        referredUserId: user.id,
        referralCodeUsed: faker.string.alphanumeric(6).toUpperCase(),
        createdAt: faker.date.recent({ days: 90 }),
      },
    });

    await prisma.discount.create({
      data: {
        id: uuid(),
        userId: user.id,
        percentage: parseFloat(
          faker.number.float({ min: 5, max: 50 }).toFixed(2)
        ),
        expiredAt: faker.date.between({
          from: dayjs().subtract(5, "year").toDate(),
          to: new Date(),
        }),
        isUsed: faker.datatype.boolean(),
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        id: uuid(),
        userId: user.id,
        eventId: event.id,
        totalPrice: ticketType.price * 2,
        appliedDiscount: 0,
        usedPoints: 5000,
        finalPrice: ticketType.price * 2 - 5000,
        paymentStatus: "PAID",
        createdAt: faker.date.recent({ days: 100 }),
      },
    });

    await prisma.ticketPurchase.create({
      data: {
        id: uuid(),
        transactionId: transaction.id,
        attendeeId: user.id,
        ticketTypeId: ticketType.id,
        quantity: 2,
        createdAt: transaction.createdAt,
      },
    });
  }

  console.log("done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
>>>>>>> 882eb577b23cedf21152309763461d6816e7ab66
