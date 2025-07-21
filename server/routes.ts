import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertDisposalLocationSchema,
  insertEventSchema,
  insertFeedbackSchema,
  insertStatsSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      // In local development mode, return a mock user for testing
      if (!process.env.REPLIT_DOMAINS) {
        return res.json({
          id: "dev-user-1",
          name: "Development User",
          email: "dev@uop.ac.lk",
          role: "admin",
        });
      }

      // Production mode - require authentication
      if (!req.user || !req.user.claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Disposal locations routes
  app.get("/api/disposal-locations", async (req, res) => {
    try {
      const { type } = req.query;
      const locations = type
        ? await storage.getDisposalLocationsByType(type as string)
        : await storage.getDisposalLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching disposal locations:", error);
      res.status(500).json({ message: "Failed to fetch disposal locations" });
    }
  });

  app.post("/api/disposal-locations", isAuthenticated, async (req, res) => {
    try {
      const locationData = insertDisposalLocationSchema.parse(req.body);
      const location = await storage.createDisposalLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating disposal location:", error);
        res.status(500).json({ message: "Failed to create disposal location" });
      }
    }
  });

  app.put("/api/disposal-locations/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const locationData = insertDisposalLocationSchema
        .partial()
        .parse(req.body);
      const location = await storage.updateDisposalLocation(id, locationData);

      if (!location) {
        return res.status(404).json({ message: "Disposal location not found" });
      }

      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating disposal location:", error);
        res.status(500).json({ message: "Failed to update disposal location" });
      }
    }
  });

  app.delete(
    "/api/disposal-locations/:id",
    isAuthenticated,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const success = await storage.deleteDisposalLocation(id);

        if (!success) {
          return res
            .status(404)
            .json({ message: "Disposal location not found" });
        }

        res.json({ message: "Disposal location deleted successfully" });
      } catch (error) {
        console.error("Error deleting disposal location:", error);
        res.status(500).json({ message: "Failed to delete disposal location" });
      }
    }
  );

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getActiveEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Failed to create event" });
      }
    }
  });

  app.post("/api/events/:id/join", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.joinEvent(eventId);

      if (!event) {
        return res
          .status(400)
          .json({ message: "Cannot join event - full or not found" });
      }

      res.json(event);
    } catch (error) {
      console.error("Error joining event:", error);
      res.status(500).json({ message: "Failed to join event" });
    }
  });

  // Feedback routes
  app.get("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const feedbackList = await storage.getFeedback();
      res.json(feedbackList);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating feedback:", error);
        res.status(500).json({ message: "Failed to create feedback" });
      }
    }
  });

  app.put("/api/feedback/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminResponse } = req.body;

      const feedback = await storage.updateFeedbackStatus(
        id,
        status,
        adminResponse
      );

      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }

      res.json(feedback);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Failed to update feedback" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const statsData = await storage.getStats();
      res.json(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.put("/api/stats", isAuthenticated, async (req, res) => {
    try {
      const statsData = insertStatsSchema.parse(req.body);
      const stats = await storage.updateStats(statsData);
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating stats:", error);
        res.status(500).json({ message: "Failed to update stats" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
