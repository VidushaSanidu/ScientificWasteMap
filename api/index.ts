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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Scientific Waste Map API is running",
  });
});

// Disposal locations endpoints
app.get("/api/disposal-locations", (req, res) => {
  // Temporary mock data - replace with actual database calls
  res.status(200).json({
    data: [],
    message: "Disposal locations endpoint (mock data)",
  });
});

// Events endpoints
app.get("/api/events", (req, res) => {
  // Temporary mock data - replace with actual database calls
  res.status(200).json({
    data: [],
    message: "Events endpoint (mock data)",
  });
});

// Feedback endpoints
app.get("/api/feedback", (req, res) => {
  // Temporary mock data - replace with actual database calls
  res.status(200).json({
    data: [],
    message: "Feedback endpoint (mock data)",
  });
});

// Stats endpoints
app.get("/api/stats", (req, res) => {
  // Temporary mock data - replace with actual database calls
  res.status(200).json({
    data: {
      totalLocations: 0,
      totalEvents: 0,
      totalFeedback: 0,
    },
    message: "Stats endpoint (mock data)",
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
  res.status(404).json({
    error: "Not Found",
    message: `API endpoint ${req.originalUrl} not found`,
    availableEndpoints: [
      "/api/health",
      "/api/disposal-locations",
      "/api/events",
      "/api/feedback",
      "/api/stats",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/logout",
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
