import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
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

  // Health check
  if (req.url === "/api/health" || req.url === "/health") {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Scientific Waste Map API is running",
    });
    return;
  }

  // Stats endpoint
  if (req.url === "/api/stats" || req.url === "/stats") {
    res.status(200).json({
      disposalPoints: 12,
      monthlyWaste: "2.5T",
      recyclableRate: "78%",
      activeUsers: "156",
    });
    return;
  }

  // Disposal locations
  if (
    req.url === "/api/disposal-locations" ||
    req.url === "/disposal-locations"
  ) {
    res.status(200).json([]);
    return;
  }

  // Events
  if (req.url === "/api/events" || req.url === "/events") {
    res.status(200).json([]);
    return;
  }

  // Feedback
  if (req.url === "/api/feedback" || req.url === "/feedback") {
    res.status(200).json([]);
    return;
  }

  // Auth endpoints
  if (req.url === "/api/auth/login" && req.method === "POST") {
    res.status(200).json({ message: "Login endpoint (mock)" });
    return;
  }

  if (req.url === "/api/auth/register" && req.method === "POST") {
    res.status(200).json({ message: "Register endpoint (mock)" });
    return;
  }

  if (req.url === "/api/auth/logout" && req.method === "POST") {
    res.status(200).json({ message: "Logout endpoint (mock)" });
    return;
  }

  // Default response
  res.status(404).json({
    error: "Not Found",
    message: `API endpoint ${req.url} not found`,
    method: req.method,
    availableEndpoints: [
      "GET /api/health",
      "GET /api/stats",
      "GET /api/disposal-locations",
      "GET /api/events",
      "GET /api/feedback",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "POST /api/auth/logout",
    ],
  });
}
