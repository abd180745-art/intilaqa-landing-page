import { pgTable, text, timestamp, boolean, varchar, jsonb } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  remoteJid: varchar("remote_jid", { length: 255 }).notNull(),
  fromMe: boolean("from_me").notNull(),
  participant: varchar("participant", { length: 255 }),
  pushName: varchar("push_name", { length: 255 }),
  messageTimestamp: timestamp("message_timestamp").notNull(),
  messageType: varchar("message_type", { length: 50 }).notNull(),
  content: text("content"),
  mediaUrl: text("media_url"),
  status: varchar("status", { length: 20 }).default("SERVER_ACK"), // SERVER_ACK, DELIVERY_ACK, READ
  rawMessage: jsonb("raw_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  pushName: varchar("push_name", { length: 255 }),
  realNumber: varchar("real_number", { length: 255 }),
  profilePictureUrl: text("profile_picture_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
