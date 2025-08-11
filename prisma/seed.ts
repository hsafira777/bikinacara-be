import { addDays, setHours, setMinutes } from "date-fns";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const organizer = await prisma.user.findFirst({
    where: {
      email: "organizer555@example.com",
      role: "ORGANIZER",
    },
  });

  if (!organizer) {
    throw new Error("Organizer not found! Pastikan user ORGANIZER ada.");
  }

  const events = [
    {
      title: "Java Jazz Festival",
      description: "Nikmati musik jazz terbaik dari musisi dunia.",
      dateOffset: 0,
      time: "19:00",
      location: "JIExpo Kemayoran, Jakarta",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4.jpg",
      eventCategory: "MUSIC",
      eventType: "PAID",
    },
    {
      title: "Bali Kite Festival",
      description: "Festival layang-layang terbesar di Bali!",
      dateOffset: 1,
      time: "15:00",
      location: "Pantai Sanur, Bali",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0.jpg",
      eventCategory: "HOLIDAYS",
      eventType: "FREE",
    },
    {
      title: "Tech Startup Conference",
      description: "Temui para founder startup dan investor di satu tempat.",
      dateOffset: 2,
      time: "09:00",
      location: "The Ritz-Carlton, Jakarta",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df.jpg",
      eventCategory: "BUSINESS",
      eventType: "PAID",
    },
    {
      title: "Borobudur Marathon",
      description: "Lari sambil menikmati pemandangan Candi Borobudur.",
      dateOffset: 3,
      time: "06:00",
      location: "Magelang, Jawa Tengah",
      image: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf.jpg",
      eventCategory: "HOBBIES",
      eventType: "PAID",
    },
    {
      title: "Anime & Comic Expo",
      description:
        "Bertemu cosplayer dan kolektor komik dari seluruh Indonesia.",
      dateOffset: 4,
      time: "10:00",
      location: "Jakarta Convention Center",
      image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769.jpg",
      eventCategory: "HOBBIES",
      eventType: "PAID",
    },
    {
      title: "Food Street Festival",
      description: "Cicipi kuliner dari seluruh daerah di Indonesia.",
      dateOffset: 5,
      time: "17:00",
      location: "Braga Street, Bandung",
      image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9.jpg",
      eventCategory: "FOOD_AND_DRINK",
      eventType: "FREE",
    },
    {
      title: "Photography Workshop",
      description: "Belajar teknik fotografi dari fotografer profesional.",
      dateOffset: 6,
      time: "13:00",
      location: "Kota Tua, Jakarta",
      image: "https://images.unsplash.com/photo-1517816428104-797678c7cf0c.jpg",
      eventCategory: "EDUCATION",
      eventType: "PAID",
    },
    {
      title: "Rock Music Night",
      description: "Konser rock dengan band ternama.",
      dateOffset: 7,
      time: "20:00",
      location: "Stadion Utama GBK, Jakarta",
      image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2.jpg",
      eventCategory: "MUSIC",
      eventType: "PAID",
    },
    {
      title: "Yoga in the Park",
      description: "Relaksasi dan meditasi di taman kota.",
      dateOffset: 8,
      time: "07:00",
      location: "Taman Suropati, Jakarta",
      image: "https://images.unsplash.com/photo-1599447421857-2f43be85b8af.jpg",
      eventCategory: "HOBBIES",
      eventType: "FREE",
    },
    {
      title: "Traditional Dance Show",
      description: "Menikmati tari tradisional dari berbagai daerah.",
      dateOffset: 9,
      time: "19:30",
      location: "Taman Ismail Marzuki, Jakarta",
      image: "https://images.unsplash.com/photo-1602785478806-69d46a4c5e7e.jpg",
      eventCategory: "ARTS",
      eventType: "PAID",
    },
  ];

  for (const event of events) {
    const [hour, minute] = event.time.split(":").map(Number);
    const date = setMinutes(
      setHours(addDays(new Date(), event.dateOffset), hour),
      minute
    );

    const createdEvent = await prisma.event.create({
      data: {
        organizerId: organizer.id,
        title: event.title,
        description: event.description,
        date,
        time: date,
        location: event.location,
        image: event.image,
        eventCategory: event.eventCategory as any,
        eventType: event.eventType as any,
        totalSeats: faker.number.int({ min: 200, max: 1000 }),
      },
    });

    // bikin harga & quota random per event
    const isFree = event.eventType === "FREE";

    const ticketTypes = [
      {
        name: "Early Bird",
        price: isFree ? 0 : faker.number.int({ min: 20000, max: 50000 }),
        quota: faker.number.int({ min: 20, max: 100 }),
      },
      {
        name: "Regular",
        price: isFree ? 0 : faker.number.int({ min: 50000, max: 100000 }),
        quota: faker.number.int({ min: 50, max: 300 }),
      },
      {
        name: "VIP",
        price: isFree ? 0 : faker.number.int({ min: 100000, max: 250000 }),
        quota: faker.number.int({ min: 10, max: 100 }),
      },
    ];

    await prisma.ticketType.createMany({
      data: ticketTypes.map((t) => ({
        id: uuid(),
        eventId: createdEvent.id,
        name: t.name,
        price: t.price,
        quota: t.quota,
      })),
    });
  }

  console.log("✅ Seeding berhasil!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
