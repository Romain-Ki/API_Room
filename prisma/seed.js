const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            { id: 1, name: 'Alice', email: 'alice@example.com', password:'123456789', admin:0},
            { id: 2, name: 'Admin', email: 'admin@admin.com', password:'admin', admin:1},
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
