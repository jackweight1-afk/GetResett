import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { setupAuth } from "./replitAuth";
import { setupEmailAuth, requireAuth, getUserId, isAuthenticatedUnified } from "./emailAuth";
import { 
  insertUserSessionSchema, 
  insertSleepEntrySchema, 
  insertStressEntrySchema,
  insertFeelingEntrySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (Replit Auth)
  await setupAuth(app);
  
  // Email/password auth
  await setupEmailAuth(app);

  // Initialize session types on startup
  await initializeSessionTypes();

  // Auth routes - supports both Replit Auth and email/password auth
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Try to get userId from either auth method
      let userId = getUserId(req);
      
      // Fallback to Replit Auth
      if (!userId && req.user?.claims?.sub) {
        userId = getUserId(req);
      }
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log("[/api/auth/user] Fetching user with ID:", userId);
      const user = await storage.getUser(userId);
      console.log("[/api/auth/user] User from database:", user ? { id: user.id, email: user.email } : 'NOT FOUND');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("[/api/auth/user] Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Session types
  app.get('/api/session-types', isAuthenticatedUnified, async (req, res) => {
    try {
      const sessionTypes = await storage.getSessionTypes();
      res.json(sessionTypes);
    } catch (error) {
      console.error("Error fetching session types:", error);
      res.status(500).json({ message: "Failed to fetch session types" });
    }
  });

  // User sessions
  app.get('/api/sessions', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const sessions = await storage.getUserSessions(userId, 20);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post('/api/sessions', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Corporate-only access: Check user is active and has organization
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (!user.isActive) {
        return res.status(403).json({ 
          message: "Account not activated. Please contact your organization administrator.",
          code: "ACCOUNT_INACTIVE"
        });
      }
      if (!user.organisationId) {
        return res.status(403).json({ 
          message: "Corporate access required. Please sign up with a valid corporate code.",
          code: "NO_CORPORATE_ACCESS"
        });
      }

      const sessionData = insertUserSessionSchema.parse({
        ...req.body,
        userId,
      });
      
      const session = await storage.createUserSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // User stats
  app.get('/api/stats', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const stats = await storage.getUserSessionStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Sleep entries
  app.get('/api/sleep', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const entries = await storage.getUserSleepEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching sleep entries:", error);
      res.status(500).json({ message: "Failed to fetch sleep entries" });
    }
  });

  app.post('/api/sleep', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const entryData = insertSleepEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createSleepEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating sleep entry:", error);
      res.status(500).json({ message: "Failed to create sleep entry" });
    }
  });

  // Stress entries
  app.post('/api/stress', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const entryData = insertStressEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createStressEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating stress entry:", error);
      res.status(500).json({ message: "Failed to create stress entry" });
    }
  });

  // Insights
  app.get('/api/insights', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const insights = await storage.getUserInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  // User stats route (for account page)
  app.get('/api/user/stats', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const stats = await storage.getUserSessionStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Feeling entries
  app.post('/api/feelings', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Corporate-only access: Check user is active and has organization
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (!user.isActive) {
        return res.status(403).json({ 
          message: "Account not activated. Please contact your organization administrator.",
          code: "ACCOUNT_INACTIVE"
        });
      }
      if (!user.organisationId) {
        return res.status(403).json({ 
          message: "Corporate access required. Please sign up with a valid corporate code.",
          code: "NO_CORPORATE_ACCESS"
        });
      }

      const feelingData = insertFeelingEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      // If this is a post-session feeling, create a corresponding user session
      let sessionId: string | undefined;
      if (feelingData.isPostSession && feelingData.feeling && feelingData.feeling !== 'feel_better') {
        // Map emotion to session type and duration (matches seeded session types in initializeSessionTypes)
        const emotionConfig: Record<string, { sessionType: string; duration: number }> = {
          'stressed': { sessionType: 'Stress Relief', duration: 75 },
          'anxious': { sessionType: 'Mindful Moment', duration: 90 },
          'cant_sleep': { sessionType: 'Sleep Story', duration: 105 },
          'achy_muscles': { sessionType: 'Upper Body Stretch', duration: 90 },
          'cant_focus': { sessionType: 'Focus Reset', duration: 90 },
          'need_confidence': { sessionType: 'Confidence Boost', duration: 75 },
        };
        
        const config = emotionConfig[feelingData.feeling];
        if (!config) {
          // Skip session creation for unknown emotions (like "feel_better")
          console.log(`Skipping session creation for feeling: ${feelingData.feeling}`);
        } else {
          // Get all session types
          const sessionTypes = await storage.getSessionTypes();
          let sessionType = sessionTypes.find(st => st.name === config.sessionType);
          
          // If session type doesn't exist, create it (shouldn't happen with defaults)
          if (!sessionType) {
            sessionType = await storage.createSessionType({
              name: config.sessionType,
              description: `Reset session for ${feelingData.feeling}`,
              icon: 'fas fa-spa',
              color: 'purple',
            });
          }
          
          // Create user session with emotion-specific duration
          const userSession = await storage.createUserSession({
            userId,
            sessionTypeId: sessionType.id,
            duration: config.duration,
            rating: feelingData.moodRating || undefined,
          });
          
          sessionId = userSession.id;
        }
      }
      
      // Create feeling entry with optional sessionId link
      const feeling = await storage.createFeelingEntry({
        ...feelingData,
        sessionId,
      });
      
      res.json(feeling);
    } catch (error) {
      console.error("Error creating feeling entry:", error);
      res.status(500).json({ message: "Failed to create feeling entry" });
    }
  });

  app.get('/api/feelings', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const feelings = await storage.getUserFeelingEntries(userId, 20);
      res.json(feelings);
    } catch (error) {
      console.error("Error fetching feelings:", error);
      res.status(500).json({ message: "Failed to fetch feelings" });
    }
  });

  // Account deletion route
  app.delete('/api/user/delete', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await storage.deleteUser(userId);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // ===== B2B PLATFORM ROUTES =====
  
  // Lead generation - Public route
  app.post('/api/leads', async (req, res) => {
    try {
      const { companyName, contactName, contactEmail, contactPhone, employeeSize, interestedTier, message } = req.body;
      
      if (!companyName || !contactName || !contactEmail || !employeeSize) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const lead = await storage.createBusinessLead({
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        employeeSize,
        interestedTier,
        message,
        status: "new"
      });

      res.json({ success: true, leadId: lead.id });
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });

  // Super admin middleware - hardcoded to only allow getresett@gmail.com
  const requireSuperAdmin = async (req: any, res: any, next: any) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user?.email) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Only allow getresett@gmail.com as super admin
      if (user.email !== 'getresett@gmail.com') {
        return res.status(403).json({ error: "Forbidden - Admin access required" });
      }

      next();
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ error: "Authorization check failed" });
    }
  };

  // Admin: Get global analytics
  app.get('/api/admin/analytics', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const analytics = await storage.getGlobalAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Admin: Get all organizations
  app.get('/api/admin/organizations', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const organizations = await storage.getAllOrganizations();
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  // Admin: Create organization (no admin user creation)
  app.post('/api/admin/organizations', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const { name, tier, employeeCount } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: "Organization name is required" });
      }

      // Generate unique corporate code
      const corporateCode = `GR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Create organization only - no admin user needed
      const organization = await storage.createOrganization({
        name,
        corporateCode,
        tier: tier || 'core',
        employeeCount: employeeCount || 0,
        pricePerSeat: 5.99,
        billingStatus: 'active',
        contactEmail: null,
        contactName: null
      });

      res.json(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  // Admin: Update organization
  app.patch('/api/admin/organizations/:id', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const updateOrgSchema = z.object({
        name: z.string().optional(),
        tier: z.enum(['core', 'growth', 'culture_partner']).optional(),
        employeeCount: z.number().int().min(0).optional(),
        billingStatus: z.enum(['active', 'inactive', 'suspended']).optional(),
      });

      const { id } = req.params;
      const updates = updateOrgSchema.parse(req.body);

      const organization = await storage.updateOrganization(id, updates);
      res.json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error updating organization:", error);
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  // Admin: Delete organization
  app.delete('/api/admin/organizations/:id', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteOrganization(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ error: "Failed to delete organization" });
    }
  });

  // Admin: Get all leads
  app.get('/api/admin/leads', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const leads = await storage.getAllBusinessLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Admin: Update lead status
  app.patch('/api/admin/leads/:id', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const lead = await storage.updateBusinessLead(id, { status, notes });
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  // Admin: Get organization analytics
  app.get('/api/admin/organizations/:id/analytics', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const analytics = await storage.getOrganizationAnalytics(id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching org analytics:", error);
      res.status(500).json({ error: "Failed to fetch organization analytics" });
    }
  });

  // Admin: Get all users
  app.get('/api/admin/users', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove sensitive fields from all users
      const safeUsers = users.map(user => {
        const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = user;
        return safeUser;
      });
      
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin: Create user
  app.post('/api/admin/users', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const createUserSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      });

      const { email, password, firstName, lastName } = createUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Import bcrypt for password hashing
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        isActive: true, // Admin-created users are active by default
        hasCompletedOnboarding: false,
      });

      // Remove sensitive fields from response
      const { passwordHash: _, resetToken: __, resetTokenExpiry: ___, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Admin: Update user status
  app.patch('/api/admin/users/:id', isAuthenticatedUnified, requireSuperAdmin, async (req, res) => {
    try {
      const updateUserSchema = z.object({
        isActive: z.boolean(),
      });

      const { id } = req.params;
      const { isActive } = updateUserSchema.parse(req.body);

      const user = await storage.updateUserStatus(id, isActive);
      
      // Remove sensitive fields from response
      const { passwordHash: _, resetToken: __, resetTokenExpiry: ___, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error updating user status:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Check if current user is super admin
  app.get('/api/user/is-super-admin', isAuthenticatedUnified, async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.json({ isSuperAdmin: false });
      }

      const user = await storage.getUser(userId);
      if (!user?.email) {
        return res.json({ isSuperAdmin: false });
      }

      const isSuperAdmin = await storage.isSuperAdmin(user.email);
      res.json({ isSuperAdmin });
    } catch (error) {
      console.error("Error checking super admin status:", error);
      res.json({ isSuperAdmin: false });
    }
  });

  // Removed company admin dashboard endpoint - no longer needed

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeSessionTypes() {
  try {
    const existingTypes = await storage.getSessionTypes();
    if (existingTypes.length === 0) {
      const defaultTypes = [
        {
          name: "Sleep Story",
          description: "A calming 60-second guided story to help you drift into peaceful sleep.",
          icon: "fas fa-moon",
          color: "purple",
        },
        {
          name: "Stress Relief",
          description: "Guided breathing exercise to calm your mind and reduce stress.",
          icon: "fas fa-wind",
          color: "blue",
        },
        {
          name: "Upper Body Stretch",
          description: "Release tension in neck, shoulders, and arms to feel refreshed.",
          icon: "fas fa-street-view",
          color: "sage",
        },
        {
          name: "Lower Body Stretch",
          description: "Stretch hips, hamstrings, and calves to improve mobility.",
          icon: "fas fa-street-view",
          color: "mint",
        },
        {
          name: "Full Body Flow",
          description: "Complete head-to-toe stretching sequence for total body relief.",
          icon: "fas fa-street-view",
          color: "emerald",
        },
        {
          name: "Energy Boost",
          description: "Quick energizing exercises to boost your mood and circulation.",
          icon: "fas fa-dumbbell",
          color: "orange",
        },
        {
          name: "Mindful Moment",
          description: "Ground yourself with a quick mindfulness exercise for clarity.",
          icon: "fas fa-spa",
          color: "teal",
        },
        {
          name: "Focus Reset",
          description: "Sharpen your concentration with a quick focus-building exercise.",
          icon: "fas fa-bullseye",
          color: "yellow",
        },
        {
          name: "Confidence Boost",
          description: "Positive affirmations and confidence-building exercises to empower you.",
          icon: "fas fa-star",
          color: "orange",
        },
      ];

      for (const type of defaultTypes) {
        await storage.createSessionType(type);
      }
    }
  } catch (error) {
    console.error("Error initializing session types:", error);
  }
}
