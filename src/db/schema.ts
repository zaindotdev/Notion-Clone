import { timestamp, pgTable, uuid, pgEnum, text } from "drizzle-orm/pg-core";

// Enums
export const role_enum = pgEnum("role", ["owner", "editor", "viewer"]);
export const subscription_status_enum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "trial",
]);

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar_url: text("avatar_url"),
  billing_address: text("billing_address"),
  payment_method: text("payment_method"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// Workspaces Table
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// Collaborators Table
export const collaborators = pgTable("collaborators", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  workspace_id: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  role: role_enum("role").notNull().default("viewer"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// Pages Table
export const pages = pgTable("pages", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  in_trash: text("in_trash"),
  workspace_id: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// Subscriptions Table
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  status: subscription_status_enum("status").notNull().default("trial"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  expired_at: timestamp("expired_at"),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});
