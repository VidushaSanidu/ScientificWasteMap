import type { Request, Response } from "express";

export default function handler(req: Request, res: Response) {
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

  // Simple health check
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Scientific Waste Map API is running",
  });
}
