import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { Pool, neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { sql as drizzleSql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// ============ SCHEMA ============
const businessLeads = pgTable("business_leads", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  companyName: varchar("company_name").notNull(),
  contactName: varchar("contact_name").notNull(),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  employeeSize: varchar("employee_size").notNull(),
  interestedTier: varchar("interested_tier"),
  message: text("message"),
  status: varchar("status").default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const allowedEmployees = pgTable("allowed_employees", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  companyId: varchar("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
  addedAt: timestamp("added_at").defaultNow(),
});

const users = pgTable("users", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  hasPremiumAccess: boolean("has_premium_access").default(false).notNull(),
  companyId: varchar("company_id").references(() => companies.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

const insertBusinessLeadSchema = createInsertSchema(businessLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const insertAllowedEmployeeSchema = createInsertSchema(allowedEmployees).omit({
  id: true,
  addedAt: true,
});

type User = typeof users.$inferSelect;
type BusinessLead = typeof businessLeads.$inferSelect;
type Company = typeof companies.$inferSelect;
type AllowedEmployee = typeof allowedEmployees.$inferSelect;

// ============ DATABASE ============
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// ============ STORAGE ============
const storage = {
  async createBusinessLead(lead: z.infer<typeof insertBusinessLeadSchema>): Promise<BusinessLead> {
    const [created] = await db.insert(businessLeads).values(lead).returning();
    return created;
  },

  async getAllBusinessLeads(): Promise<BusinessLead[]> {
    return db.select().from(businessLeads).orderBy(desc(businessLeads.createdAt));
  },

  async createUser(user: { email: string; passwordHash: string; hasPremiumAccess: boolean; companyId: string | null }): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user;
  },

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id));
  },

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  },

  async createCompany(company: z.infer<typeof insertCompanySchema>): Promise<Company> {
    const [created] = await db.insert(companies).values(company).returning();
    return created;
  },

  async getAllCompanies(): Promise<Company[]> {
    return db.select().from(companies).orderBy(desc(companies.createdAt));
  },

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  },

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    const [updated] = await db.update(companies).set({ ...updates, updatedAt: new Date() }).where(eq(companies.id, id)).returning();
    return updated;
  },

  async deleteCompany(id: string): Promise<void> {
    await db.delete(companies).where(eq(companies.id, id));
  },

  async createAllowedEmployee(employee: z.infer<typeof insertAllowedEmployeeSchema>): Promise<AllowedEmployee> {
    const [created] = await db.insert(allowedEmployees).values({ ...employee, email: employee.email.toLowerCase() }).returning();
    return created;
  },

  async getEmployeeByEmail(email: string): Promise<AllowedEmployee | undefined> {
    const [employee] = await db.select().from(allowedEmployees).where(eq(allowedEmployees.email, email.toLowerCase()));
    return employee;
  },

  async getEmployeesByCompany(companyId: string): Promise<AllowedEmployee[]> {
    return db.select().from(allowedEmployees).where(eq(allowedEmployees.companyId, companyId)).orderBy(desc(allowedEmployees.addedAt));
  },

  async deleteAllowedEmployee(id: string): Promise<void> {
    await db.delete(allowedEmployees).where(eq(allowedEmployees.id, id));
  },

  async bulkCreateAllowedEmployees(employees: z.infer<typeof insertAllowedEmployeeSchema>[]): Promise<AllowedEmployee[]> {
    const normalized = employees.map(e => ({ ...e, email: e.email.toLowerCase() }));
    return db.insert(allowedEmployees).values(normalized).returning();
  },
};

// ============ PASSPORT ============
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      await storage.updateUserLastLogin(user.id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUserById(id);
    done(null, user || null);
  } catch (error) {
    done(error);
  }
});

// ============ EXPRESS APP ============
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PgSession = connectPgSimple(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "getreset-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ============ MIDDLEWARE ============
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

function isMasterAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as any)?.email?.toLowerCase() === "getresett@gmail.com") {
    return next();
  }
  res.status(403).json({ error: "Forbidden - Admin access required" });
}

// ============ ROUTES ============
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    // Normalize email once for all operations
    const normalizedEmail = email.trim().toLowerCase();
    
    const existingUser = await storage.getUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Check if this is the master admin email (special case - can sign up without whitelist)
    const isMasterAdminEmail = normalizedEmail === "getresett@gmail.com";
    
    const allowedEmployee = await storage.getEmployeeByEmail(normalizedEmail);
    if (!allowedEmployee && !isMasterAdminEmail) {
      return res.status(403).json({ 
        error: "Access Denied",
        message: "Your email is not authorized for GetReset+. Please contact your employer's HR department to be added to the employee list."
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await storage.createUser({
      email: normalizedEmail,
      passwordHash,
      hasPremiumAccess: true,
      companyId: allowedEmployee?.companyId || null,
    });
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log in after signup" });
      }
      res.json({
        user: { id: user.id, email: user.email, hasPremiumAccess: user.hasPremiumAccess, companyId: user.companyId },
        isPremium: user.hasPremiumAccess,
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

app.post('/api/auth/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: User, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || "Invalid credentials" });
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({
        user: { id: user.id, email: user.email, hasPremiumAccess: user.hasPremiumAccess, companyId: user.companyId },
      });
    });
  })(req, res, next);
});

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Failed to log out" });
    res.json({ success: true });
  });
});

app.get('/api/auth/me', isAuthenticated, (req, res) => {
  const user = req.user as User;
  res.json({
    user: { id: user.id, email: user.email, hasPremiumAccess: user.hasPremiumAccess, companyId: user.companyId },
  });
});

app.post('/api/business-leads', async (req, res) => {
  try {
    const leadData = insertBusinessLeadSchema.parse(req.body);
    const lead = await storage.createBusinessLead(leadData);
    res.json({ success: true, leadId: lead.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error creating business lead:", error);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

app.get('/api/business-leads', async (_req, res) => {
  try {
    const leads = await storage.getAllBusinessLeads();
    res.json(leads);
  } catch (error) {
    console.error("Error fetching business leads:", error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// Admin routes
app.get('/api/admin/companies', isMasterAdmin, async (_req, res) => {
  try {
    const allCompanies = await storage.getAllCompanies();
    res.json(allCompanies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

app.post('/api/admin/companies', isMasterAdmin, async (req, res) => {
  try {
    const companyData = insertCompanySchema.parse(req.body);
    const company = await storage.createCompany(companyData);
    res.json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error creating company:", error);
    res.status(500).json({ error: "Failed to create company" });
  }
});

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  seatCount: z.number().int().positive().optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
}).strict();

app.patch('/api/admin/companies/:id', isMasterAdmin, async (req, res) => {
  try {
    const updates = updateCompanySchema.parse(req.body);
    const company = await storage.updateCompany(req.params.id, updates);
    res.json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Failed to update company" });
  }
});

app.delete('/api/admin/companies/:id', isMasterAdmin, async (req, res) => {
  try {
    await storage.deleteCompany(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
});

app.get('/api/admin/companies/:companyId/employees', isMasterAdmin, async (req, res) => {
  try {
    const employees = await storage.getEmployeesByCompany(req.params.companyId);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

app.post('/api/admin/companies/:companyId/employees', isMasterAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const employee = await storage.createAllowedEmployee({ email, companyId: req.params.companyId });
    res.json(employee);
  } catch (error: any) {
    if (error?.code === '23505') {
      return res.status(400).json({ error: "This email is already in the whitelist" });
    }
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Failed to add employee" });
  }
});

app.post('/api/admin/companies/:companyId/employees/bulk', isMasterAdmin, async (req, res) => {
  try {
    const { emails } = req.body;
    const companyId = req.params.companyId;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "Emails array is required" });
    }
    const employees = emails.map((email: string) => ({ email, companyId }));
    const created = await storage.bulkCreateAllowedEmployees(employees);
    res.json({ success: true, count: created.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error bulk adding employees:", error);
    res.status(500).json({ error: "Failed to bulk add employees" });
  }
});

app.delete('/api/admin/employees/:id', isMasterAdmin, async (req, res) => {
  try {
    await storage.deleteAllowedEmployee(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

app.get('/api/admin/users', isMasterAdmin, async (_req, res) => {
  try {
    const allUsers = await storage.getAllUsers();
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
