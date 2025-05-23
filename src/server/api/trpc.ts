
/*
This sets up tRPC helper functions like:

createTRPCContext – for passing things like session, DB client, etc.

createTRPCRouter – a utility to define routers.

*/

// import { initTRPC } from "@trpc/server";
// import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

// // Context function - We Can customize hook as needed - { session , db}

// export const createTRPCContext = async (otps: CreateNextContextOptions) => {
//   return {}
// }

// // Init TRPC

// const t = initTRPC.context<typeof createTRPCContext>().create()

// export const createTRPCRouter = t.router
// export const publicProcedure = t.procedure




import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "../db";

export const createTRPCContext = async (opts: { req?: Request }) => {
  return {
    // You can add any context you want here
    // For example, you could access headers from the request:
    db,
    headers: opts.req?.headers,
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