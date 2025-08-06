import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

async function main() {
  const users = [];
  const organizers = [];

  // Buat 5 user attendee
  for (let i = 0; i < 2; i++) {
    const user = await prisma.user.create({
      data: {
        id: uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "ATTENDEE",
      },
    });
    users.push(user);
  }

  // Buat 5 organizer
  for (let i = 0; i < 2; i++) {
    const organizer = await prisma.user.create({
      data: {
        id: uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "ORGANIZER",
      },
    });
    organizers.push(organizer);
  }

  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    const organizer = faker.helpers.arrayElement(organizers);

    const eventDate = faker.date.between({
      from: dayjs().subtract(5, "year").toDate(),
      to: dayjs().add(1, "year").toDate(),
    });

    const event = await prisma.event.create({
      data: {
        id: uuid(),
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        date: eventDate,
        time: dayjs(eventDate)
          .set("hour", faker.number.int({ min: 8, max: 22 }))
          .toDate(),
        location: faker.location.city(),
        eventCategory: "MUSIC",
        eventType: "PAID" ,
        totalSeats: faker.number.int({ min: 50, max: 500 }),
        organizerId: organizer.id,
      },
    });

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
