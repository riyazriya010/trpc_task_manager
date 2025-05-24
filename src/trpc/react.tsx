"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "production" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  let vercelUrl = process.env.VERCEL_URL || "https://trpc-task-manager.vercel.app"
  if (vercelUrl) return `https://${vercelUrl}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}












// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { httpBatchLink, loggerLink } from "@trpc/client";
// import { createTRPCReact } from "@trpc/react-query";
// import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
// import { useState } from "react";
// import SuperJSON from "superjson";
// import { type AppRouter } from "~/server/api/root";

// // Singleton pattern for QueryClient
// let clientQueryClientSingleton: QueryClient | undefined = undefined;

// const createQueryClient = () => {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         retry: (failureCount, error: any) => {
//           // Don't retry on 404s or 401s
//           if (error?.data?.httpStatus === 404) return false;
//           if (error?.data?.code === 'UNAUTHORIZED') return false;
//           return failureCount < 3; // Retry up to 3 times
//         },
//       },
//       mutations: {
//         retry: false,
//       },
//     },
//   });
// };

// const getQueryClient = () => {
//   if (typeof window === "undefined") {
//     // Server: always make a new query client
//     return createQueryClient();
//   }
//   // Browser: use singleton pattern
//   return (clientQueryClientSingleton ??= createQueryClient());
// };

// export const api = createTRPCReact<AppRouter>();

// export type RouterInputs = inferRouterInputs<AppRouter>;
// export type RouterOutputs = inferRouterOutputs<AppRouter>;

// export function TRPCReactProvider(props: { children: React.ReactNode }) {
//   const queryClient = getQueryClient();

//   const [trpcClient] = useState(() =>
//     api.createClient({
//       links: [
//         loggerLink({
//           enabled: (op) => 
//             process.env.NODE_ENV === "development" ||
//             (op.direction === "down" && op.result instanceof Error),
//           logger: (op) => {
//             if (op.direction === "down" && op.result instanceof Error) {
//               console.error('TRPC Client Error:', {
//                 path: op.path,
//                 input: op.input,
//                 error: op.result,
//                 stack: op.result.stack,
//               });
//             } else if (process.env.NODE_ENV === "development") {
//               console.log('[TRPC]', op.direction, op.path, op.input);
//             }
//           },
//         }),
//         httpBatchLink({
//           transformer: SuperJSON,
//           url: getBaseUrl() + "/api/trpc",
//           headers: () => {
//             const headers = new Headers();
//             headers.set("x-trpc-source", "nextjs-react");
            
//             // Add auth token if available
//             if (typeof window !== "undefined") {
//               const token = localStorage.getItem('auth-token');
//               if (token) {
//                 headers.set("Authorization", `Bearer ${token}`);
//               }
//             }

//             // Additional headers for production
//             if (process.env.NODE_ENV === "production") {
//               headers.set("x-request-id", crypto.randomUUID());
//             }

//             return headers;
//           },
//         }),
//       ],
//     })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       <api.Provider client={trpcClient} queryClient={queryClient}>
//         {props.children}
//       </api.Provider>
//     </QueryClientProvider>
//   );
// }

// function getBaseUrl() {
//   if (typeof window !== "undefined") {
//     console.debug('[TRPC] Using window origin:', window.location.origin);
//     return window.location.origin;
//   }
  
//   // Vercel deployment URL
//   if (process.env.VERCEL_URL) {
//     console.debug('[TRPC] Using VERCEL_URL:', process.env.VERCEL_URL);
//     return `https://${process.env.VERCEL_URL}`;
//   }

//   // Fallback for server-side rendering
//   if (process.env.NEXT_PUBLIC_APP_URL) {
//     console.debug('[TRPC] Using NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
//     return process.env.NEXT_PUBLIC_APP_URL;
//   }

//   // Local development
//   console.debug('[TRPC] Using localhost');
//   return `http://localhost:${process.env.PORT ?? 3000}`;
// }

// // Utility function for error handling
// export function handleTRPCError(error: unknown) {
//   if (error instanceof Error && 'data' in error) {
//     const trpcError = error as { data?: { code?: string; httpStatus?: number } };
//     if (trpcError.data?.code === 'UNAUTHORIZED') {
//       // Handle unauthorized errors
//       if (typeof window !== "undefined") {
//         window.location.href = '/login';
//       }
//     }
//     return trpcError;
//   }
//   return error;
// }