import dotenv from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Load environment variables
dotenv.config();

// Configure Neon for serverless environments
if (typeof window === "undefined") {
  // Only set WebSocket constructor in Node.js environment
  neonConfig.webSocketConstructor = ws;
}

// Configure connection pooling for serverless
neonConfig.poolQueryViaFetch = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

console.log("Initializing database connection...");

// Create connection pool with serverless-optimized settings
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit connections in serverless environment
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout for cold starts
});

// Add connection error handling
pool.on("error", (err) => {
  console.error("Database pool error:", err);
});

export const db = drizzle({ client: pool, schema });

console.log("Database connection initialized successfully");
