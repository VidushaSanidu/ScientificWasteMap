import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes.js";
import { serveStatic } from "../server/vite.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Setup routes
registerRoutes(app);

// Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error details for debugging
  console.error("API Error:", {
    path: req.path,
    method: req.method,
    status,
    message,
    stack: err.stack,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  // Return appropriate error response
  if (status === 500) {
    res.status(status).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? message : undefined,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(status).json({ message });
  }
});

// For Vercel deployment, we don't need to listen on a port
// Vercel handles that for us
export default app;
