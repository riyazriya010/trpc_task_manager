
// // This File combines all of our trpc routers to single appRouter, Which will be exposed to front-end

// import { sayHello } from "./routers/hello";
// import { taskRouter } from "./routers/task";
// import { createTRPCRouter } from "./trpc";

// export const appRouter = createTRPCRouter({
//   hello: sayHello,
//   task: taskRouter
// })


// // Export type definition of api
// export type AppRouter = typeof appRouter;


import { sayHello } from "./routers/hello";
import { taskRouter } from "./routers/task";

import { createTRPCRouter } from "./trpc";
import { createTRPCContext } from "./trpc"; // ⬅ Import context

import { createTRPCRouter, createCallerFactory } from "./trpc";


export const appRouter = createTRPCRouter({
  hello: sayHello,
  task: taskRouter,
});


// Export type definition of API
export type AppRouter = typeof appRouter;

// ✅ Export createCaller for use in RSC
export const createCaller = (ctx: Awaited<ReturnType<typeof createTRPCContext>>) =>
  appRouter.createCaller(ctx);

export type AppRouter = typeof appRouter;

// Expose a `createCaller` for RSC
export const createCaller = createCallerFactory(appRouter);
