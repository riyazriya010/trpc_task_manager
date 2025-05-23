import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed']);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  status: taskStatusEnum("status").default("pending").notNull(),
  imgUrl: varchar("img_url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});