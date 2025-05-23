/*

 This sets up the frontend hooks like api.hello.greeting.useQuery() using @trpc/react-query.

 createTRPCReact generates typed React hooks for your backend API.
 
 It uses AppRouter to infer all procedures/types.

 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/api/root";

export const api = createTRPCReact<AppRouter>();

