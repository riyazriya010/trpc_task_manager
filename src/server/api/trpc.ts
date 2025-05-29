
/*
This sets up tRPC helper functions like:

createTRPCContext – for passing things like session, DB client, etc.

createTRPCRouter – a utility to define routers.

*/
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "../db";


export const createTRPCContext = async (opts: { req?: Request, headers?: Headers }) => {
export const createTRPCContext = async (opts: { req?: Request; headers?: Headers }) => {

  return {
    db,
    headers: opts.headers ?? opts.req?.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
