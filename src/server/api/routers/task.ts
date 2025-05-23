import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { tasks } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().max(1000).optional(),
        status: z.enum(["pending", "in_progress", "completed"]).optional(),
        imgUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [task] = await ctx.db.insert(tasks).values({
        title: input.title,
        description: input.description,
        status: input.status ?? "pending",
        imgUrl: input.imgUrl,
      }).returning();
      return task;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tasks);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [task] = await ctx.db
        .select()
        .from(tasks)
        .where(eq(tasks.id, input.id));
      return task ?? null;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(1000).optional().nullable(),
        status: z.enum(["pending", "in_progress", "completed"]).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [task] = await ctx.db
        .update(tasks)
        .set({
          title: input.title,
          description: input.description,
          status: input.status,
        })
        .where(eq(tasks.id, input.id))
        .returning();

      return task;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [task] = await ctx.db
        .delete(tasks)
        .where(eq(tasks.id, input.id))
        .returning();

      return task;
    }),
});