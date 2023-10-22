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
            image: '/images/dawulwuru.png',
            emailVerified: new Date(),
            name: 'Dawul Wuru Corporation',
            role: 'Moderator',
        }
    });
    const viewerUser = await prisma.user.upsert({
        where: { email: 'viewer@gmail.com' },
        update: {},
        create: {
            email: 'viewer@gmail.com',
            image: 'https://i0.wp.com/cdn.auth0.com/avatars/vi.png?ssl=1',
            emailVerified: new Date(),
            name: 'Viewer User',
            role: 'Viewer',
        }
    });
    const creatorUser = await prisma.user.upsert({
        where: { email: 'creator@gmail.com' },
        update: {},
        create: {
            email: 'creator@gmail.com',
            image: 'https://i0.wp.com/cdn.auth0.com/avatars/cr.png?ssl=1',
            emailVerified: new Date(),
            name: 'Creator User',
            role: 'Creator',
        }
    });
    console.log({ ewbUser, dwUser, viewerUser, creatorUser });
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