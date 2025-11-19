import {
  businessLeads,
  type BusinessLead,
  type InsertBusinessLead,
} from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

// Simple storage interface for business leads only
export interface IStorage {
  // Business leads
  createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead>;
  getAllBusinessLeads(): Promise<BusinessLead[]>;
  updateBusinessLead(id: string, updates: Partial<BusinessLead>): Promise<BusinessLead>;
}

export class PgStorage implements IStorage {
  // Business leads
  async createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead> {
    const [created] = await db
      .insert(businessLeads)
      .values(lead)
      .returning();
    return created;
  }

  async getAllBusinessLeads(): Promise<BusinessLead[]> {
    return db
      .select()
      .from(businessLeads)
      .orderBy(desc(businessLeads.createdAt));
  }

  async updateBusinessLead(id: string, updates: Partial<BusinessLead>): Promise<BusinessLead> {
    const [updated] = await db
      .update(businessLeads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessLeads.id, id))
      .returning();
    return updated;
  }
}

export const storage = new PgStorage();
