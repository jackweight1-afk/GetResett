import { sql } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  varchar,
  text,
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
