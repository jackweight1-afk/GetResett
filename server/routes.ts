import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertUserSessionSchema, 
  insertSleepEntrySchema, 
  insertStressEntrySchema,
  insertFeelingEntrySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize session types on startup
  await initializeSessionTypes();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Session types
  app.get('/api/session-types', isAuthenticated, async (req, res) => {
    try {
      const sessionTypes = await storage.getSessionTypes();
      res.json(sessionTypes);
    } catch (error) {
      console.error("Error fetching session types:", error);
      res.status(500).json({ message: "Failed to fetch session types" });
    }
  });

  // User sessions
  app.get('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserSessions(userId, 20);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserSessionStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Sleep entries
  app.get('/api/sleep', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getUserSleepEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching sleep entries:", error);
      res.status(500).json({ message: "Failed to fetch sleep entries" });
    }
  });

  app.post('/api/sleep', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.post('/api/stress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.get('/api/insights', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const insights = await storage.getUserInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  // User stats route (for account page)
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserSessionStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Feeling entries
  app.post('/api/feelings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const feelingData = insertFeelingEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const feeling = await storage.createFeelingEntry(feelingData);
      res.json(feeling);
    } catch (error) {
      console.error("Error creating feeling entry:", error);
      res.status(500).json({ message: "Failed to create feeling entry" });
    }
  });

  app.get('/api/feelings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const feelings = await storage.getUserFeelingEntries(userId, 20);
      res.json(feelings);
    } catch (error) {
      console.error("Error fetching feelings:", error);
      res.status(500).json({ message: "Failed to fetch feelings" });
    }
  });

  // Account deletion route
  app.delete('/api/user/delete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteUser(userId);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

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
      ];

      for (const type of defaultTypes) {
        await storage.createSessionType(type);
      }
    }
  } catch (error) {
    console.error("Error initializing session types:", error);
  }
}
