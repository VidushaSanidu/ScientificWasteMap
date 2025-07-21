#!/usr/bin/env node

import { config } from "dotenv";
import { authService } from "../server/auth.js";
import { storage } from "../server/storage.js";

// Load environment variables
config();

async function testLogin() {
  console.log("=== Login Test Script ===");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Database URL present:", !!process.env.DATABASE_URL);
  console.log("JWT Secret present:", !!process.env.JWT_SECRET);
  console.log("Admin Email present:", !!process.env.ADMIN_EMAIL);
  console.log("Admin Password present:", !!process.env.ADMIN_PASSWORD);

  try {
    // Test database connection
    console.log("\n1. Testing database connection...");
    const testUser = await storage.getUserByEmail("test@example.com");
    console.log("Database connection: OK");

    // Test admin user creation
    console.log("\n2. Testing admin user creation...");
    try {
      await authService.createAdminUser();
      console.log("Admin user creation: OK");
    } catch (error) {
      console.log("Admin user creation:", error.message);
    }

    // Test login with admin credentials
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      console.log("\n3. Testing admin login...");
      try {
        const result = await authService.login({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        });
        console.log("Admin login: OK");
        console.log("Token generated:", !!result.token);
      } catch (error) {
        console.error("Admin login failed:", error.message);
      }
    } else {
      console.log("\n3. Skipping admin login test - credentials not set");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }

  console.log("\n=== Test Complete ===");
  process.exit(0);
}

testLogin();
