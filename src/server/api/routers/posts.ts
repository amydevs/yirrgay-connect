import { z } from 'zod';
import {
  createTRPCRouter,
  creatorProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const postsRouter = createTRPCRouter({
  create: creatorProtectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          userId: ctx.session.user.id,
        },
      });
    }),
  update: creatorProtectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
      }),
    )
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
  delete: creatorProtectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({
        where: {
          id: input.id,
        },
        include: {
          user: true,
          likes: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, likes: true },
    });
  }),
  like: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.like.create({
        data: {
          postId: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.like.delete({
        where: {
          userId_postId: {
            postId: input.id,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
