import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organizer = await prisma.user.create({
    data: {
      id: "a1111111-b222-c333-d444-e55555555555",
      name: "Organizer Dummy",
      email: "organizer@example.com",
      password: "dummyhashedpassword", // bisa bcrypt kalau real
      role: "ORGANIZER", // atau apapun enum-nya di schema kamu
    },
  });


  await prisma.event.createMany({
    data: [
      {
        id: "e1111111-b222-c333-d444-e55555555555",
        organizerId: organizer.id,
        title: "Gratis Ngoding Bareng",
        description: "Belajar ngoding dari nol secara gratis!",
        date: new Date("2025-08-10"),
        time: new Date("2025-08-10T14:00:00Z"),
        location: "Bandung",
        eventType: "FREE",
        totalSeats: 50,
        createdAt: new Date(),
      },
      {
        id: "e2222222-b222-c333-d444-e55555555555",
        organizerId: organizer.id,
        title: "Workshop UI/UX",
        description: "Belajar desain dari mentor senior!",
        date: new Date("2025-08-15"),
        time: new Date("2025-08-15T10:00:00Z"),
        location: "Jakarta",
        eventType: "PAID",
        totalSeats: 30,
        createdAt: new Date(),
      },
    ],
  });

  console.log("✅ Dummy events berhasil ditambahkan");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
