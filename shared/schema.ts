import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  real,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Organisations table for corporate access
export const organisations = pgTable("organisations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  corporateCode: varchar("corporate_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"), // For email/password auth (nullable for Replit Auth users)
  organisationId: varchar("organisation_id").references(() => organisations.id),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status"), // active, canceled, past_due, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessionTypes = pgTable("session_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon").notNull(),
  color: varchar("color").notNull(),
  duration: integer("duration").default(60), // duration in seconds
});

export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionTypeId: varchar("session_type_id").notNull().references(() => sessionTypes.id),
  completedAt: timestamp("completed_at").defaultNow(),
  duration: integer("duration"), // actual duration in seconds
  rating: integer("rating"), // 1-5 rating
  notes: text("notes"),
});

export const dailyUsage = pgTable("daily_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  sessionCount: integer("session_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("daily_usage_user_date_idx").on(table.userId, table.date),
  unique("daily_usage_user_date_unique").on(table.userId, table.date)
]);

export const sleepEntries = pgTable("sleep_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").references(() => userSessions.id),
  sleepQuality: integer("sleep_quality").notNull(), // 1-10 scale
  hoursSlept: real("hours_slept"),
  bedTime: timestamp("bed_time"),
  wakeTime: timestamp("wake_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stressEntries = pgTable("stress_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").references(() => userSessions.id),
  stressLevel: integer("stress_level").notNull(), // 1-10 scale
  stressSource: varchar("stress_source"), // work, personal, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(userSessions),
  sleepEntries: many(sleepEntries),
  stressEntries: many(stressEntries),
}));

export const sessionTypesRelations = relations(sessionTypes, ({ many }) => ({
  sessions: many(userSessions),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
  sessionType: one(sessionTypes, {
    fields: [userSessions.sessionTypeId],
    references: [sessionTypes.id],
  }),
}));

export const sleepEntriesRelations = relations(sleepEntries, ({ one }) => ({
  user: one(users, {
    fields: [sleepEntries.userId],
    references: [users.id],
  }),
  session: one(userSessions, {
    fields: [sleepEntries.sessionId],
    references: [userSessions.id],
  }),
}));

export const stressEntriesRelations = relations(stressEntries, ({ one }) => ({
  user: one(users, {
    fields: [stressEntries.userId],
    references: [users.id],
  }),
  session: one(userSessions, {
    fields: [stressEntries.sessionId],
    references: [userSessions.id],
  }),
}));

// Insert schemas
export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  completedAt: true,
});

export const insertSleepEntrySchema = createInsertSchema(sleepEntries).omit({
  id: true,
  createdAt: true,
});

export const insertStressEntrySchema = createInsertSchema(stressEntries).omit({
  id: true,
  createdAt: true,
});

export const insertSessionTypeSchema = createInsertSchema(sessionTypes).omit({
  id: true,
});

// Feeling entries table for tracking emotional check-ins
export const feelingEntries = pgTable("feeling_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  feeling: varchar("feeling").notNull(), // stressed, anxiety, restless, overwhelmed, tired, scattered
  moodRating: integer("mood_rating"), // 1-10 scale for post-reset check
  isPostSession: boolean("is_post_session").default(false),
  sessionId: varchar("session_id").references(() => userSessions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeelingEntrySchema = createInsertSchema(feelingEntries).omit({
  id: true,
  createdAt: true,
});

// Insert schemas
export const insertOrganisationSchema = createInsertSchema(organisations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Organisation = typeof organisations.$inferSelect;
export type InsertOrganisation = z.infer<typeof insertOrganisationSchema>;
export type DailyUsage = typeof dailyUsage.$inferSelect;
export type InsertDailyUsage = typeof dailyUsage.$inferInsert;
export type FeelingEntry = typeof feelingEntries.$inferSelect;
export type SessionType = typeof sessionTypes.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
export type SleepEntry = typeof sleepEntries.$inferSelect;
export type StressEntry = typeof stressEntries.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type InsertSleepEntry = z.infer<typeof insertSleepEntrySchema>;
export type InsertStressEntry = z.infer<typeof insertStressEntrySchema>;
export type InsertSessionType = z.infer<typeof insertSessionTypeSchema>;
export type InsertFeelingEntry = z.infer<typeof insertFeelingEntrySchema>;
