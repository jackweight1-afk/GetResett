import { sql } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Business leads table for lead generation from contact form
export const businessLeads = pgTable("business_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: varchar("company_name").notNull(),
  contactName: varchar("contact_name").notNull(),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  employeeSize: varchar("employee_size").notNull(), // 1-50, 51-250, 251+
  interestedTier: varchar("interested_tier"), // core, growth, culture_partner
  message: text("message"),
  status: varchar("status").default("new"), // new, contacted, converted, lost
  notes: text("notes"), // Admin notes (for future use if needed)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schema
export const insertBusinessLeadSchema = createInsertSchema(businessLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type BusinessLead = typeof businessLeads.$inferSelect;
export type InsertBusinessLead = z.infer<typeof insertBusinessLeadSchema>;

// Companies table for B2B customers
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

// Allowed employees table - email whitelist for premium access
export const allowedEmployees = pgTable("allowed_employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  companyId: varchar("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertAllowedEmployeeSchema = createInsertSchema(allowedEmployees).omit({
  id: true,
  addedAt: true,
});

export type AllowedEmployee = typeof allowedEmployees.$inferSelect;
export type InsertAllowedEmployee = z.infer<typeof insertAllowedEmployeeSchema>;

// Users table for authentication and premium access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  hasPremiumAccess: boolean("has_premium_access").default(false).notNull(),
  companyId: varchar("company_id").references(() => companies.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
