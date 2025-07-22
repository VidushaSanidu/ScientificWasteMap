import express, { type Request, Response, NextFunction } from "express";

// Create express app for Vercel serverless function
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Root route for debugging
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Scientific Waste Map API",
    status: "running",
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "GET /api/health",
      "GET /health",
      "GET /api/disposal-locations",
      "GET /api/events",
      "GET /api/feedback",
      "GET /api/stats",
    ],
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Scientific Waste Map API is running",
  });
});

// Health check without /api prefix (for Vercel routing)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Scientific Waste Map API is running",
  });
});

// Disposal locations endpoints
app.get("/api/disposal-locations", (req, res) => {
  // Return empty array as expected by frontend
  res.status(200).json([]);
});

app.get("/disposal-locations", (req, res) => {
  res.status(200).json([]);
});

// Events endpoints
app.get("/api/events", (req, res) => {
  // Return empty array as expected by frontend
  res.status(200).json([]);
});

app.get("/events", (req, res) => {
  res.status(200).json([]);
});

// Feedback endpoints
app.get("/api/feedback", (req, res) => {
  // Return empty array as expected by frontend
  res.status(200).json([]);
});

app.get("/feedback", (req, res) => {
  res.status(200).json([]);
});

// Stats endpoints
app.get("/api/stats", (req, res) => {
  // Return stats data in the format expected by frontend
  res.status(200).json({
    disposalPoints: 12,
    monthlyWaste: "2.5T",
    recyclableRate: "78%",
    activeUsers: "156",
  });
});

app.get("/stats", (req, res) => {
  res.status(200).json({
    disposalPoints: 12,
    monthlyWaste: "2.5T",
    recyclableRate: "78%",
    activeUsers: "156",
  });
});

// Auth endpoints
app.post("/api/auth/login", (req, res) => {
  res.status(200).json({
    message: "Login endpoint (mock)",
  });
});

app.post("/api/auth/register", (req, res) => {
  res.status(200).json({
    message: "Register endpoint (mock)",
  });
});

app.post("/api/auth/logout", (req, res) => {
  res.status(200).json({
    message: "Logout endpoint (mock)",
  });
});

// Catch-all for undefined routes
app.use("*", (req, res) => {
  console.log(`[404] Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Not Found",
    message: `API endpoint ${req.originalUrl} not found`,
    method: req.method,
    url: req.originalUrl,
    availableEndpoints: [
      "GET /api/health",
      "GET /health",
      "GET /api/disposal-locations",
      "GET /disposal-locations",
      "GET /api/events",
      "GET /events",
      "GET /api/feedback",
      "GET /feedback",
      "GET /api/stats",
      "GET /stats",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "POST /api/auth/logout",
    ],
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("API Error:", {
    path: req.path,
    method: req.method,
    status,
    message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  res.status(status).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development" ? message : "Something went wrong",
    timestamp: new Date().toISOString(),
  });
});

// Export for Vercel
export default app;
