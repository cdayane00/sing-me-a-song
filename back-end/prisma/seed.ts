import { prisma } from "../src/database";

const main = async () => {
    const recommendations = [
        {
            name: 'Promises',
            youtubeLink: 'https://www.youtube.com/watch?v=q5m09rqOoxE'
        },
        {
            name: 'Jireh',
            youtubeLink: 'https://www.youtube.com/watch?v=mC-zw0zCCtg'
        },
        {
            name: 'Wait On You',
            youtubeLink: 'https://www.youtube.com/watch?v=K3TYG7Q_fj4'
        },
    ];

    await prisma.recommendation.createMany({data: recommendations});
};

main().catch((error)=>console.error(error)).finally(async ()=> prisma.$disconnect());