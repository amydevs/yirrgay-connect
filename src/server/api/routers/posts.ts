import { z } from "zod";
import {
  createTRPCRouter,
  creatorProtectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  create: creatorProtectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          userId: ctx.session.user.id
        },
      });
    }),
  update: creatorProtectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),
  getById: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({
        where: {
          id: input.id
        },
        include: {
          user: true,
        }
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }),
});