import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { setupAuth, isAuthenticated } from "./replitAuth.js";
import { authService } from "./auth.js";
import { healthCheck } from "./health.js";
import {
  authenticateToken,
  requireAdmin,
  optionalAuth,
  type AuthenticatedRequest,
} from "./middleware/auth.js";
import {
  insertDisposalLocationSchema,
  insertEventSchema,
  insertFeedbackSchema,
  insertStatsSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint with caching and timeout handling
  app.get("/api/health", healthCheck);

  // Initialize admin user on startup
  try {
    await authService.createAdminUser();
  } catch (error) {
    console.log("Admin user initialization:", (error as Error).message);
  }

  // New Authentication Routes
  // Registration endpoint disabled - login only
  // app.post("/api/auth/register", async (req, res) => {
  //   try {
  //     const { email, password, firstName, lastName } = req.body;

  //     if (!email || !password) {
  //       return res
  //         .status(400)
  //         .json({ message: "Email and password are required" });
  //     }

  //     const result = await authService.register({
  //       email,
  //       password,
  //       firstName,
  //       lastName,
  //     });

  //     const { password: _, ...userWithoutPassword } = result.user;
  //     res.status(201).json({
  //       user: userWithoutPassword,
  //       token: result.token,
  //     });
  //   } catch (error: any) {
  //     console.error("Registration error:", error);
  //     res.status(400).json({ message: error.message || "Registration failed" });
  //   }
  // });

  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Login attempt started for:", req.body.email);

      const { email, password } = req.body;

      if (!email || !password) {
        console.log("Login failed: missing email or password");
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      console.log("Attempting to authenticate user:", email);
      const result = await authService.login({ email, password });

      const { password: _, ...userWithoutPassword } = result.user;
      console.log("Login successful for user:", email);

      res.json({
        user: userWithoutPassword,
        token: result.token,
      });
    } catch (error: any) {
      console.error("Login error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        email: req.body?.email,
      });

      // Return a more specific error message based on the error type
      if (
        error.message &&
        error.message.includes("Invalid email or password")
      ) {
        res.status(401).json({ message: "Invalid email or password" });
      } else if (error.message && error.message.includes("database")) {
        console.error("Database connection error during login");
        res
          .status(500)
          .json({ message: "Database connection error. Please try again." });
      } else {
        res.status(500).json({
          message:
            "An unexpected error occurred during login. Please try again.",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // For JWT, logout is handled client-side by removing the token
    res.json({ message: "Logged out successfully" });
  });

  // Get current user (with optional authentication)
  app.get("/api/auth/user", optionalAuth as any, async (req: any, res: any) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
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

  app.post(
    "/api/disposal-locations",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
      try {
        const locationData = insertDisposalLocationSchema.parse(req.body);
        const location = await storage.createDisposalLocation(locationData);
        res.status(201).json(location);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        } else {
          console.error("Error creating disposal location:", error);
          res
            .status(500)
            .json({ message: "Failed to create disposal location" });
        }
      }
    }
  );

  app.put(
    "/api/disposal-locations/:id",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
      try {
        const id = parseInt(req.params.id);
        const locationData = insertDisposalLocationSchema
          .partial()
          .parse(req.body);
        const location = await storage.updateDisposalLocation(id, locationData);

        if (!location) {
          return res
            .status(404)
            .json({ message: "Disposal location not found" });
        }

        res.json(location);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        } else {
          console.error("Error updating disposal location:", error);
          res
            .status(500)
            .json({ message: "Failed to update disposal location" });
        }
      }
    }
  );

  app.delete(
    "/api/disposal-locations/:id",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
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

  app.post(
    "/api/events",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
      try {
        console.log("Received event data:", req.body);
        const eventData = insertEventSchema.parse(req.body);
        console.log("Parsed event data:", eventData);
        const event = await storage.createEvent(eventData);
        res.status(201).json(event);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation errors:", error.errors);
          res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        } else {
          console.error("Error creating event:", error);
          res.status(500).json({ message: "Failed to create event" });
        }
      }
    }
  );

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

  app.delete(
    "/api/events/:id",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
      try {
        const eventId = parseInt(req.params.id);
        const success = await storage.deleteEvent(eventId);

        if (!success) {
          return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
      } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Failed to delete event" });
      }
    }
  );

  // Feedback routes
  app.get(
    "/api/feedback",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
      try {
        const feedbackList = await storage.getFeedback();
        res.json(feedbackList);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Failed to fetch feedback" });
      }
    }
  );

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

  app.put(
    "/api/feedback/:id",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
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
    }
  );

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

  app.put(
    "/api/stats",
    authenticateToken as any,
    requireAdmin as any,
    async (req: any, res: any) => {
      try {
        const statsData = insertStatsSchema.parse(req.body);
        const stats = await storage.updateStats(statsData);
        res.json(stats);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        } else {
          console.error("Error updating stats:", error);
          res.status(500).json({ message: "Failed to update stats" });
        }
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
