import type { Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  try {
    // Basic diagnostic information
    const diagnostics = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: req.headers,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        hasAdminPassword: !!process.env.ADMIN_PASSWORD,
      },
      versions: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };

    console.log("Debug endpoint called:", diagnostics);
    res.status(200).json(diagnostics);
  } catch (error) {
    console.error("Debug endpoint error:", error);
    res.status(500).json({
      error: "Debug endpoint failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
