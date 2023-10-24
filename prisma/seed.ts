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
            posts: {
                create: {
                    title: 'Multimedia Showcase',
                    content:
`## Text

Welcome to YirrgayConnect!

## Video

<video title="" src="https://github.com/Eyevinn/mp4ff/raw/master/examples/multitrack/testdata/main_1.mp4" controls style="width: 100%;" />

## Audio

<audio title="" src="https://www.myinstants.com/media/sounds/sorting-algorythim.mp3" controls style="width: 100%;" />

## Scratch

::scratch{#10012676}

## Image

![DawulWuru](/images/dawulwuru.png)`
                }
            }
        }
    });
    const sampleUser = await prisma.user.upsert({
        where: { email: 'gavin.blakey@ewb.org.au' },
        update: {},
        create: {
            email: 'gavin.blakey@ewb.org.au',
            image: 'https://i0.wp.com/cdn.auth0.com/avatars/gb.png?ssl=1',
            emailVerified: new Date(),
            name: 'Gavin Blakey',
            role: 'Creator',
            posts: {
                create: {
                    title: 'On Yirrganydji Country with Dawul Wuru',
                    content:
`![Image](https://ewb.org.au/wp-content/uploads/2022/01/DSCF5064-1-980x653.jpg)
Sometimes life takes some unexpected turns. I was born and raised in Cairns but now live in Brisbane. On a recent trip to visit family in North Queensland, I dropped in on EWB staff Grace Roberts and George Goddard who were on their first scoping trip for the 2022 EWB Challenge.

Before departing Brisbane, George mentioned that he and Grace would be doing a site inspection with Brian Singleton, Senior Ranger of the Yirrganydji Land and Sea Rangers and Board Director at CfAT. When I saw the word Yirrganydji, it sounded a lot like Irukandji. I remembered that when I was a Cub and Scout in Cairns, we were part of the Irukandji Scout District. I looked in my cupboard and lo and behold, nearly 50 years later I still had my Irukandji district badge from my Scout uniform! 

Badge in hand, I went to visit Grace, George and Brian who took us to an area of Yirrganydji-managed land at the mouth of the Barron River on the northern outskirts of Cairns, called Dungurra. It turns out that the Irukandji badge is being used as evidence in a recent native title claim to demonstrate that the area was known to be Yirrganydji (Irukandji) land in and around Cairns. Brian was very pleased to see a badge in-person as he and many of his colleagues had only seen photos of such a badge. I gave the badge to Brian in case it could be useful to him.
`
                }
            }
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
            posts: {
                create: {
                    title: 'Welcome to the YirrgayConnect!',
                    content: 'Welcome to the YirrgayConnect!'
                }
            }
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
    console.log({ ewbUser, sampleUser, dwUser, viewerUser, creatorUser });
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