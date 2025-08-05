import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organizer = await prisma.user.create({
    data: {
      id: "a2222222-b222-c333-d444-e55555555555",
      name: "Organizer Dummy 2",
      email: "organizer2@example.com",
      password: "dummyhashedpassword2",
      role: "ORGANIZER",
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
        eventCategory: "EDUCATION",
        totalSeats: 50,
        createdAt: new Date(),
        image:
          "https://res.cloudinary.com/dwzmh50ev/image/upload/v1754412123/66a74c948980a5b1fbce2ad0_633c1b64cc7edf69d4a5a060_coding20programming_205_zae2j8.jpg",
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
        eventCategory: "ARTS",
        totalSeats: 30,
        createdAt: new Date(),
        image:
          "https://res.cloudinary.com/dwzmh50ev/image/upload/v1754403910/event_images/mwdnw3aqoeupefaf2v78.jpg",
      },
      {
        id: "e3333333-b222-c333-d444-e55555555555",
        organizerId: organizer.id,
        title: "Malam Musik Akustik",
        description: "Nikmati malam penuh musik akustik di taman kota.",
        date: new Date("2025-08-20"),
        time: new Date("2025-08-20T18:30:00Z"),
        location: "Yogyakarta",
        eventType: "PAID",
        eventCategory: "MUSIC",
        totalSeats: 100,
        createdAt: new Date(),
        image:
          "https://res.cloudinary.com/dwzmh50ev/image/upload/v1754411968/konserJakarta_pvely7.jpg",
      },
      {
        id: "e4444444-b222-c333-d444-e55555555555",
        organizerId: organizer.id,
        title: "Networking Bisnis Digital",
        description: "Bertemu dan belajar dari para pelaku bisnis digital.",
        date: new Date("2025-08-25"),
        time: new Date("2025-08-25T09:00:00Z"),
        location: "Surabaya",
        eventType: "FREE",
        eventCategory: "BUSINESS",
        totalSeats: 75,
        createdAt: new Date(),
        image:
          "https://res.cloudinary.com/dwzmh50ev/image/upload/v1754403910/event_images/mwdnw3aqoeupefaf2v78.jpg",
      },
      {
        id: "e5555555-b222-c333-d444-e55555555555",
        organizerId: organizer.id,
        title: "Festival Kuliner Nusantara",
        description: "Rasakan cita rasa dari berbagai daerah di Indonesia.",
        date: new Date("2025-08-30"),
        time: new Date("2025-08-30T11:00:00Z"),
        location: "Medan",
        eventType: "PAID",
        eventCategory: "FOOD_AND_DRINK",
        totalSeats: 200,
        createdAt: new Date(),
        image:
          "https://res.cloudinary.com/dwzmh50ev/image/upload/v1753246680/cld-sample-4.jpg",
      },
    ],
  });

  console.log("✅ Dummy events berhasil ditambahkan");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
