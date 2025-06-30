const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {




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

    console.log('✅ Données de seed insérées !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
