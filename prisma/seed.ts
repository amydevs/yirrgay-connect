import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const ewbUser = await prisma.user.upsert({
        where: { email: 'info@ewb.org.au' },
        update: {},
        create: {
            email: 'info@ewb.org.au',
            image: '/images/ewb.jpg',
            emailVerified: new Date(),
            name: 'Engineers Without Borders',
            role: 'Moderator',
        }
    });
    const dwUser = await prisma.user.upsert({
        where: { email: 'info@dawulwuru.com.au' },
        update: {},
        create: {
            email: 'info@dawulwuru.com.au',
            image: '/images/dawulwuru.jpg',
            emailVerified: new Date(),
            name: 'Dawul Wuru Corporation',
            role: 'Moderator',
        }
    });
    console.log({ ewbUser, dwUser });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });