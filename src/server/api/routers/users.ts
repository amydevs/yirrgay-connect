import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
        include: {
          posts: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              likes: true,
            },
          },
        },
      });
    }),
});
