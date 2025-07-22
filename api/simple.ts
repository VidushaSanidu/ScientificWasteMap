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

  // ================== HEALTH CHECK ==================
  if (req.url === "/api/health" || req.url === "/health") {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Scientific Waste Map API is running",
    });
    return;
  }

  // ================== STATS ENDPOINTS ==================
  if (
    (req.url === "/api/stats" || req.url === "/stats") &&
    req.method === "GET"
  ) {
    res.status(200).json({
      disposalPoints: 12,
      monthlyWaste: "2.5T",
      recyclableRate: "78%",
      activeUsers: "156",
    });
    return;
  }

  if (
    (req.url === "/api/stats" || req.url === "/stats") &&
    req.method === "PUT"
  ) {
    res.status(200).json({
      message: "Stats updated successfully",
      data: req.body,
    });
    return;
  }

  // ================== DISPOSAL LOCATIONS ==================
  if (
    (req.url === "/api/disposal-locations" ||
      req.url === "/disposal-locations") &&
    req.method === "GET"
  ) {
    res.status(200).json([]);
    return;
  }

  if (
    (req.url === "/api/disposal-locations" ||
      req.url === "/disposal-locations") &&
    req.method === "POST"
  ) {
    res.status(201).json({
      message: "Disposal location created successfully",
      data: { id: Math.floor(Math.random() * 1000), ...req.body },
    });
    return;
  }

  // DELETE disposal location by ID
  if (
    req.url?.match(/^\/api\/disposal-locations\/\d+$/) &&
    req.method === "DELETE"
  ) {
    const id = req.url.split("/").pop();
    res.status(200).json({
      message: `Disposal location ${id} deleted successfully`,
    });
    return;
  }

  // ================== EVENTS ==================
  if (
    (req.url === "/api/events" || req.url === "/events") &&
    req.method === "GET"
  ) {
    res.status(200).json([]);
    return;
  }

  if (
    (req.url === "/api/events" || req.url === "/events") &&
    req.method === "POST"
  ) {
    res.status(201).json({
      message: "Event created successfully",
      data: { id: Math.floor(Math.random() * 1000), ...req.body },
    });
    return;
  }

  // DELETE event by ID
  if (req.url?.match(/^\/api\/events\/\d+$/) && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    res.status(200).json({
      message: `Event ${id} deleted successfully`,
    });
    return;
  }

  // JOIN event by ID
  if (req.url?.match(/^\/api\/events\/\d+\/join$/) && req.method === "POST") {
    const id = req.url.split("/")[3];
    res.status(200).json({
      message: `Successfully joined event ${id}`,
    });
    return;
  }

  // ================== FEEDBACK ==================
  if (
    (req.url === "/api/feedback" || req.url === "/feedback") &&
    req.method === "GET"
  ) {
    res.status(200).json([]);
    return;
  }

  if (
    (req.url === "/api/feedback" || req.url === "/feedback") &&
    req.method === "POST"
  ) {
    res.status(201).json({
      message: "Feedback submitted successfully",
      data: { id: Math.floor(Math.random() * 1000), ...req.body },
    });
    return;
  }

  // UPDATE feedback by ID
  if (req.url?.match(/^\/api\/feedback\/\d+$/) && req.method === "PUT") {
    const id = req.url.split("/").pop();
    res.status(200).json({
      message: `Feedback ${id} updated successfully`,
      data: req.body,
    });
    return;
  }

  // ================== AUTH ENDPOINTS ==================
  if (req.url === "/api/auth/user" && req.method === "GET") {
    // Check for Authorization header or return 401
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Return mock user data if authenticated
    res.status(200).json({
      id: "mock-user-123",
      email: "user@example.com",
      password: null, // Don't return password
      firstName: "John",
      lastName: "Doe",
      profileImageUrl: null,
      role: "user",
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  if (req.url === "/api/auth/login" && req.method === "POST") {
    res.status(200).json({
      message: "Login successful",
      token: "mock-jwt-token-123456", // Mock JWT token
      user: {
        id: "mock-user-123",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        profileImageUrl: null,
        role: "user",
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return;
  }

  if (req.url === "/api/auth/register" && req.method === "POST") {
    res.status(201).json({
      message: "Registration successful",
      token: "mock-jwt-token-123457",
      user: {
        id: "mock-user-124",
        email: req.body?.email || "newuser@example.com",
        firstName: req.body?.firstName || "Jane",
        lastName: req.body?.lastName || "Smith",
        profileImageUrl: null,
        role: "user",
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return;
  }

  if (req.url === "/api/auth/logout" && req.method === "POST") {
    res.status(200).json({ message: "Logout successful" });
    return;
  }

  // ================== LEGACY LOGIN/LOGOUT (for redirects) ==================
  if (req.url === "/api/login") {
    res.redirect(302, "/auth");
    return;
  }

  if (req.url === "/api/logout") {
    res.redirect(302, "/");
    return;
  }

  // ================== DEFAULT 404 ==================
  res.status(404).json({
    error: "Not Found",
    message: `API endpoint ${req.url} not found`,
    method: req.method,
    availableEndpoints: [
      "GET /api/health",
      "GET /api/stats",
      "PUT /api/stats",
      "GET /api/disposal-locations",
      "POST /api/disposal-locations",
      "DELETE /api/disposal-locations/{id}",
      "GET /api/events",
      "POST /api/events",
      "DELETE /api/events/{id}",
      "POST /api/events/{id}/join",
      "GET /api/feedback",
      "POST /api/feedback",
      "PUT /api/feedback/{id}",
      "GET /api/auth/user",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "POST /api/auth/logout",
    ],
  });
}
