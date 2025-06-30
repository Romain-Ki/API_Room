const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            { id: 1, name: 'Alice', email: 'alice@example.com', password:'123456789', admin:0},
            { id: 2, name: 'Admin', email: 'admin@admin.com', password:'admin', admin:1},
        ],
        skipDuplicates: true,
    });

    await prisma.room.create({
        data: {
            name: 'Salle A',
            capacity: 10,
            features: ["TV", "Tableau blanc", "Visioconférence"],
            rules: {
                maxDurationMinutes: 120,
                allowWeekends: false,
                minAdvanceHours: 3,
            },
        },
    });

    await prisma.room.create({
        data: {
            name: 'Salle B',
            capacity: 90,
            features: ["god michele", "lubrifiant", "capote"],
            rules: {},
        },
    });

    const roomA = await prisma.room.findFirst({ where: { name: 'Salle A' } });
    const roomB = await prisma.room.findFirst({ where: { name: 'Salle B' } });

    if (roomA && roomB) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        const tomorrowEnd = new Date(tomorrow);
        tomorrowEnd.setHours(tomorrow.getHours() + 1);

        await prisma.booking.create({
            data: {
                start: tomorrow,
                end: tomorrowEnd,
                userId: 1,
                roomId: roomA.id,
            },
        });

        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        dayAfterTomorrow.setHours(14, 0, 0, 0);
        const dayAfterTomorrowEnd = new Date(dayAfterTomorrow);
        dayAfterTomorrowEnd.setHours(dayAfterTomorrow.getHours() + 3);

        await prisma.booking.create({
            data: {
                start: dayAfterTomorrow,
                end: dayAfterTomorrowEnd,
                userId: 2,
                roomId: roomB.id,
            },
        });
    }

    console.log('✅ Données de seed insérées !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }
);