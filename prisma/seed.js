const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' },
        ],
    });

    console.log('✅ Données de seed insérées !');

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

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
