import { z } from "zod";
import {
  createTRPCRouter,
  creatorProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
    create: creatorProtectedProcedure
        .input(z.object({
            content: z.string(),
            postId: z.string(),
        }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.comment.create({
                data: {
                    userId: ctx.session.user.id,
                    content: input.content,
                    postId: input.postId,
                },
            });
        }),
    delete: creatorProtectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.comment.delete({
                where: {
                    id: input.id
                },
            });
        }),
    getByPostId: publicProcedure
        .input(z.object({
            postId: z.string(),
        }))
        .query(({ ctx, input }) => {
            return ctx.prisma.comment.findMany({
                where: {
                    postId: input.postId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        })
});