import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertBusinessLeadSchema, insertUserSchema, insertCompanySchema, insertAllowedEmployeeSchema, type User } from "@shared/schema";
import passport from "./auth";

// Update schema for companies - only allow specific fields
const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  seatCount: z.number().int().positive().optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
}).strict();

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      hasPremiumAccess: boolean;
      companyId: string | null;
    }
  }
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Middleware to check if user is master admin
function isMasterAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user?.email.toLowerCase() === "getresett@gmail.com") {
    return next();
  }
  res.status(403).json({ error: "Forbidden - Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Normalize email once for all operations
      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Check if this is the master admin email (special case - can sign up without whitelist)
      const isMasterAdminEmail = normalizedEmail === "getresett@gmail.com";
      
      // Check if email is in allowed employees list (unless master admin)
      const allowedEmployee = await storage.getEmployeeByEmail(normalizedEmail);
      if (!allowedEmployee && !isMasterAdminEmail) {
        return res.status(403).json({ 
          error: "Access Denied",
          message: "Your email is not authorized for GetReset+. Please contact your employer's HR department to be added to the employee list."
        });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user with premium access (master admin or whitelisted employees)
      const user = await storage.createUser({
        email: normalizedEmail,
        passwordHash,
        hasPremiumAccess: true,
        companyId: allowedEmployee?.companyId || null,
      });

      // Log in the user after signup
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to log in after signup" });
        }
        
        res.json({
          user: {
            id: user.id,
            email: user.email,
            hasPremiumAccess: user.hasPremiumAccess,
            companyId: user.companyId,
          },
          isPremium: user.hasPremiumAccess,
        });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    passport.authenticate('local', (err: any, user: User, info: any) => {
      if (err) {
        console.error("Login authentication error:", err);
        return res.status(500).json({ error: "An error occurred during login. Please try again." });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid email or password" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session login error:", loginErr);
          return res.status(500).json({ error: "Failed to create session. Please try again." });
        }
        res.json({
          user: {
            id: user.id,
            email: user.email,
            hasPremiumAccess: user.hasPremiumAccess,
            companyId: user.companyId,
          },
        });
      });
    })(req, res, () => {});
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.json({ success: true });
    });
  });

  app.get('/api/auth/me', isAuthenticated, (req, res) => {
    res.json({
      user: {
        id: req.user!.id,
        email: req.user!.email,
        hasPremiumAccess: req.user!.hasPremiumAccess,
        companyId: req.user!.companyId,
      },
    });
  });

  // Business leads - Contact form submissions
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

  // Get all business leads (for future admin view if needed)
  app.get('/api/business-leads', async (_req, res) => {
    try {
      const leads = await storage.getAllBusinessLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching business leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Admin routes - Companies
  app.get('/api/admin/companies', isMasterAdmin, async (_req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
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

  app.put('/api/admin/companies/:id', isMasterAdmin, async (req, res) => {
    try {
      const updateData = updateCompanySchema.parse(req.body);
      const company = await storage.updateCompany(req.params.id, updateData);
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

  // Admin routes - Allowed Employees
  app.get('/api/admin/employees/:companyId', isMasterAdmin, async (req, res) => {
    try {
      const employees = await storage.getEmployeesByCompany(req.params.companyId);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.post('/api/admin/employees', isMasterAdmin, async (req, res) => {
    try {
      const employeeData = insertAllowedEmployeeSchema.parse(req.body);
      const employee = await storage.createAllowedEmployee(employeeData);
      res.json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error adding employee:", error);
      res.status(500).json({ error: "Failed to add employee" });
    }
  });

  app.post('/api/admin/employees/bulk', isMasterAdmin, async (req, res) => {
    try {
      const bulkSchema = z.object({
        companyId: z.string(),
        emails: z.array(z.string().email()),
      });
      const { companyId, emails } = bulkSchema.parse(req.body);
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

  // Admin routes - Usage Reporting
  app.get('/api/admin/users', isMasterAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  const server = createServer(app);
  return server;
}
