import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertBusinessLeadSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const server = createServer(app);
  return server;
}
