
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

// // main()
// //   .catch((e) => {
// //     console.error("❌ Gagal saat seeding:", e);
// //   })
// //   .finally(async () => {
// //     await prisma.$disconnect();
// //   });