import {
  businessLeads,
  type BusinessLead,
  type InsertBusinessLead,
  users,
  type User,
  type InsertUser,
  companies,
  type Company,
  type InsertCompany,
  allowedEmployees,
  type AllowedEmployee,
  type InsertAllowedEmployee,
} from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  // Business leads
  createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead>;
  getAllBusinessLeads(): Promise<BusinessLead[]>;
  updateBusinessLead(id: string, updates: Partial<BusinessLead>): Promise<BusinessLead>;
  
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  updateUserLastLogin(id: string): Promise<void>;
  updateUserPremiumAccess(id: string, hasPremiumAccess: boolean, companyId: string | null): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Companies
  createCompany(company: InsertCompany): Promise<Company>;
  getAllCompanies(): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | undefined>;
  updateCompany(id: string, updates: Partial<Company>): Promise<Company>;
  deleteCompany(id: string): Promise<void>;
  
  // Allowed Employees
  createAllowedEmployee(employee: InsertAllowedEmployee): Promise<AllowedEmployee>;
  getEmployeeByEmail(email: string): Promise<AllowedEmployee | undefined>;
  getEmployeesByCompany(companyId: string): Promise<AllowedEmployee[]>;
  deleteAllowedEmployee(id: string): Promise<void>;
  bulkCreateAllowedEmployees(employees: InsertAllowedEmployee[]): Promise<AllowedEmployee[]>;
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

  // Users
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db
      .insert(users)
      .values(user)
      .returning();
    return created;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  async updateUserPremiumAccess(id: string, hasPremiumAccess: boolean, companyId: string | null): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ hasPremiumAccess, companyId })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  // Companies
  async createCompany(company: InsertCompany): Promise<Company> {
    const [created] = await db
      .insert(companies)
      .values(company)
      .returning();
    return created;
  }

  async getAllCompanies(): Promise<Company[]> {
    return db
      .select()
      .from(companies)
      .orderBy(desc(companies.createdAt));
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id));
    return company;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    const [updated] = await db
      .update(companies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updated;
  }

  async deleteCompany(id: string): Promise<void> {
    await db
      .delete(companies)
      .where(eq(companies.id, id));
  }

  // Allowed Employees
  async createAllowedEmployee(employee: InsertAllowedEmployee): Promise<AllowedEmployee> {
    const [created] = await db
      .insert(allowedEmployees)
      .values({ ...employee, email: employee.email.toLowerCase() })
      .returning();
    return created;
  }

  async getEmployeeByEmail(email: string): Promise<AllowedEmployee | undefined> {
    const [employee] = await db
      .select()
      .from(allowedEmployees)
      .where(eq(allowedEmployees.email, email.toLowerCase()));
    return employee;
  }

  async getEmployeesByCompany(companyId: string): Promise<AllowedEmployee[]> {
    return db
      .select()
      .from(allowedEmployees)
      .where(eq(allowedEmployees.companyId, companyId))
      .orderBy(desc(allowedEmployees.addedAt));
  }

  async deleteAllowedEmployee(id: string): Promise<void> {
    await db
      .delete(allowedEmployees)
      .where(eq(allowedEmployees.id, id));
  }

  async bulkCreateAllowedEmployees(employees: InsertAllowedEmployee[]): Promise<AllowedEmployee[]> {
    const normalized = employees.map(e => ({ ...e, email: e.email.toLowerCase() }));
    return db
      .insert(allowedEmployees)
      .values(normalized)
      .returning();
  }
}

export const storage = new PgStorage();
