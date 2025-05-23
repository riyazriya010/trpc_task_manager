/*
Here we will define feature specific router
*/

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const sayHello = createTRPCRouter({
    greeting: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
            return {
                message: `Hello - ${input.name}`
            };
        }),
});

