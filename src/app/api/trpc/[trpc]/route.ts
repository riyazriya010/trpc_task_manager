/* 
This is the Api handler connects the Fron-end with Back-end TRPC

createTRPCReact - generates typed React hooks for your backend API.

It uses AppRouter to infer all procedures/types.

*/

// import { createNextApiHandler } from "@trpc/server/adapters/next";
// import { appRouter } from "~/server/api/root";
// import { createTRPCContext } from "~/server/api/trpc";

// export default createNextApiHandler({
//   router: appRouter,
//   createContext: createTRPCContext
// });


import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
  });

export { handler as GET, handler as POST };
