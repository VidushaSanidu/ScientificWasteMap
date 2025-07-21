import type { Request, Response } from "express";

let healthCache: any = null;
let lastHealthCheck = 0;
const HEALTH_CACHE_DURATION = 30000; // 30 seconds

export async function healthCheck(req: Request, res: Response) {
  try {
    const now = Date.now();

    // Return cached result if recent
    if (healthCache && now - lastHealthCheck < HEALTH_CACHE_DURATION) {
      return res.json(healthCache);
    }

    console.log("Health check requested at:", new Date().toISOString());

    // Basic health status
    const healthStatus: any = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasAdminCredentials: !!(
        process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
      ),
      region: process.env.VERCEL_REGION || "unknown",
      runtime: "Node.js " + process.version,
    };

    // Try database connection with timeout
    try {
      const { storage } = await import("./storage");
      const dbTestPromise = storage.getUserByEmail("test@example.com");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 5000)
      );

      await Promise.race([dbTestPromise, timeoutPromise]);
      healthStatus.database = "connected";
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn("Database health check failed:", errorMessage);
      healthStatus.database = "error";
      healthStatus.dbError = errorMessage;
    }

    // Cache the result
    healthCache = healthStatus;
    lastHealthCheck = now;

    console.log("Health check completed:", healthStatus);
    res.json(healthStatus);
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
