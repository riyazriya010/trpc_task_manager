import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, {max: 1}); // Supabase recommends keeping it small 
export const db = drizzle(client, { schema });