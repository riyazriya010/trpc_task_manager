// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// // const connectionString = process.env.DATABASE_URL!;
// const connectionString = "postgresql://postgres:riyaz@merN004@db.qgndfzrmesloopqzuodq.supabase.co:5432/postgres"
// const client = postgres(connectionString, {max: 1}); // Supabase recommends keeping it small 
// export const db = drizzle(client, { schema });


// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// const connectionString = process.env.DATABASE_URL!;
// const client = postgres(connectionString, { max: 1 }); // Supabase recommends small pool
// export const db = drizzle(client, { schema });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use env variable, don't hardcode
const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  max: 1,
  hostname: "db.qgndfzrmesloopqzuodq.supabase.co", // optional hint
  ssl: 'require', // ensures SSL connection (important for Supabase on Vercel)
});

export const db = drizzle(client, { schema });
