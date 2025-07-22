import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc } from "drizzle-orm";
import * as schema from "../shared/schema.js";
import {
  insertDisposalLocationSchema,
  insertEventSchema,
  insertFeedbackSchema,
  insertStatsSchema,
  users,
  disposalLocations,
  events,
  feedback,
  stats,
} from "../shared/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Configure Neon for serverless
neonConfig.poolQueryViaFetch = true;

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const db = drizzle({ client: pool, schema });

// JWT secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Helper function to verify JWT token
function verifyToken(authHeader?: string): any {
  if (!authHeader) return null;

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return user[0]?.role === "admin";
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  console.log(`API Request: ${req.method} ${req.url}`);

  try {
    // ================== HEALTH CHECK ==================
    if (req.url === "/api/health" || req.url === "/health") {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Scientific Waste Map API is running",
        database: "connected",
      });
      return;
    }

    // ================== AUTHENTICATION ==================
    if (req.url === "/api/auth/login" && req.method === "POST") {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      // Find user by email
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      const user = userResult[0];

      if (!user || !user.password) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token,
      });
      return;
    }

    if (req.url === "/api/auth/logout" && req.method === "POST") {
      res.json({ message: "Logged out successfully" });
      return;
    }

    if (req.url === "/api/auth/user" && req.method === "GET") {
      const token = verifyToken(req.headers.authorization as string);
      if (!token) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, token.id))
        .limit(1);
      const user = userResult[0];

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
      return;
    }

    // ================== STATS ENDPOINTS ==================
    if (
      (req.url === "/api/stats" || req.url === "/stats") &&
      req.method === "GET"
    ) {
      const statsResult = await db
        .select()
        .from(stats)
        .orderBy(desc(stats.updatedAt))
        .limit(1);

      if (statsResult.length === 0) {
        // Return default stats if none exist
        res.status(200).json({
          disposalPoints: 0,
          monthlyWaste: "0T",
          recyclableRate: "0%",
          activeUsers: "0",
        });
      } else {
        const latestStats = statsResult[0];
        res.status(200).json({
          disposalPoints: latestStats.disposalPoints || 0,
          monthlyWaste: latestStats.monthlyWaste || "0T",
          recyclableRate: latestStats.recyclableRate || "0%",
          activeUsers: latestStats.activeUsers || "0",
        });
      }
      return;
    }

    if (
      (req.url === "/api/stats" || req.url === "/stats") &&
      req.method === "PUT"
    ) {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const statsData = insertStatsSchema.parse(req.body);

      // Update or insert stats
      const result = await db.insert(stats).values(statsData).returning();

      res.status(200).json({
        message: "Stats updated successfully",
        data: result[0],
      });
      return;
    }

    // ================== DISPOSAL LOCATIONS ==================
    if (
      (req.url === "/api/disposal-locations" ||
        req.url === "/disposal-locations") &&
      req.method === "GET"
    ) {
      const { type } = req.query;

      let locations;
      if (type) {
        locations = await db
          .select()
          .from(disposalLocations)
          .where(eq(disposalLocations.type, type as string))
          .orderBy(desc(disposalLocations.createdAt));
      } else {
        locations = await db
          .select()
          .from(disposalLocations)
          .orderBy(desc(disposalLocations.createdAt));
      }

      res.status(200).json(locations);
      return;
    }

    if (
      (req.url === "/api/disposal-locations" ||
        req.url === "/disposal-locations") &&
      req.method === "POST"
    ) {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const locationData = insertDisposalLocationSchema.parse(req.body);
      const result = await db
        .insert(disposalLocations)
        .values(locationData)
        .returning();

      res.status(201).json({
        message: "Disposal location created successfully",
        data: result[0],
      });
      return;
    }

    // DELETE disposal location by ID
    if (
      req.url?.match(/^\/api\/disposal-locations\/\d+$/) &&
      req.method === "DELETE"
    ) {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const id = parseInt(req.url.split("/").pop()!);
      const result = await db
        .delete(disposalLocations)
        .where(eq(disposalLocations.id, id))
        .returning();

      if (result.length === 0) {
        res.status(404).json({ message: "Disposal location not found" });
        return;
      }

      res.status(200).json({
        message: `Disposal location ${id} deleted successfully`,
      });
      return;
    }

    // PUT disposal location by ID
    if (
      req.url?.match(/^\/api\/disposal-locations\/\d+$/) &&
      req.method === "PUT"
    ) {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const id = parseInt(req.url.split("/").pop()!);
      const locationData = insertDisposalLocationSchema
        .partial()
        .parse(req.body);

      const result = await db
        .update(disposalLocations)
        .set({ ...locationData, updatedAt: new Date() })
        .where(eq(disposalLocations.id, id))
        .returning();

      if (result.length === 0) {
        res.status(404).json({ message: "Disposal location not found" });
        return;
      }

      res.status(200).json({
        message: "Disposal location updated successfully",
        data: result[0],
      });
      return;
    }

    // ================== EVENTS ==================
    if (
      (req.url === "/api/events" || req.url === "/events") &&
      req.method === "GET"
    ) {
      const eventsResult = await db
        .select()
        .from(events)
        .where(eq(events.isActive, true))
        .orderBy(desc(events.eventDate));

      res.status(200).json(eventsResult);
      return;
    }

    if (
      (req.url === "/api/events" || req.url === "/events") &&
      req.method === "POST"
    ) {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const eventData = insertEventSchema.parse(req.body);
      const result = await db.insert(events).values(eventData).returning();

      res.status(201).json({
        message: "Event created successfully",
        data: result[0],
      });
      return;
    }

    // DELETE event by ID
    if (req.url?.match(/^\/api\/events\/\d+$/) && req.method === "DELETE") {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const id = parseInt(req.url.split("/").pop()!);
      const result = await db
        .update(events)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(events.id, id))
        .returning();

      if (result.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      res.status(200).json({
        message: `Event ${id} deleted successfully`,
      });
      return;
    }

    // PUT event by ID
    if (req.url?.match(/^\/api\/events\/\d+$/) && req.method === "PUT") {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const id = parseInt(req.url.split("/").pop()!);
      const eventData = insertEventSchema.partial().parse(req.body);

      const result = await db
        .update(events)
        .set({ ...eventData, updatedAt: new Date() })
        .where(eq(events.id, id))
        .returning();

      if (result.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      res.status(200).json({
        message: "Event updated successfully",
        data: result[0],
      });
      return;
    }

    // ================== FEEDBACK ==================
    if (
      (req.url === "/api/feedback" || req.url === "/feedback") &&
      req.method === "GET"
    ) {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const feedbackResult = await db
        .select()
        .from(feedback)
        .orderBy(desc(feedback.createdAt));

      res.status(200).json(feedbackResult);
      return;
    }

    if (
      (req.url === "/api/feedback" || req.url === "/feedback") &&
      req.method === "POST"
    ) {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const result = await db.insert(feedback).values(feedbackData).returning();

      res.status(201).json({
        message: "Feedback submitted successfully",
        data: result[0],
      });
      return;
    }

    // PUT feedback by ID (for admin responses)
    if (req.url?.match(/^\/api\/feedback\/\d+$/) && req.method === "PUT") {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      const id = parseInt(req.url.split("/").pop()!);
      const { adminResponse, status } = req.body;

      const result = await db
        .update(feedback)
        .set({
          adminResponse,
          status: status || "reviewed",
          updatedAt: new Date(),
        })
        .where(eq(feedback.id, id))
        .returning();

      if (result.length === 0) {
        res.status(404).json({ message: "Feedback not found" });
        return;
      }

      res.status(200).json({
        message: "Feedback updated successfully",
        data: result[0],
      });
      return;
    }

    // ================== ADMIN ROUTES ==================
    if (req.url === "/api/admin/dashboard" && req.method === "GET") {
      const token = verifyToken(req.headers.authorization as string);
      if (!token || !(await isAdmin(token.id))) {
        res.status(403).json({ message: "Admin access required" });
        return;
      }

      // Get dashboard statistics
      const [locationsCount, eventsCount, feedbackCount, usersCount] =
        await Promise.all([
          db.select().from(disposalLocations),
          db.select().from(events).where(eq(events.isActive, true)),
          db.select().from(feedback),
          db.select().from(users),
        ]);

      res.status(200).json({
        totalLocations: locationsCount.length,
        totalEvents: eventsCount.length,
        totalFeedback: feedbackCount.length,
        totalUsers: usersCount.length,
        recentFeedback: feedbackCount.slice(0, 5),
        upcomingEvents: eventsCount.slice(0, 5),
      });
      return;
    }

    // ================== 404 HANDLER ==================
    res.status(404).json({
      message: "Endpoint not found",
      url: req.url,
      method: req.method,
    });
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid data",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      });
    }
  }
}
