import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Neon for serverless
neonConfig.poolQueryViaFetch = true;

async function verifyDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL environment variable is not set");
    return false;
  }

  console.log("🔍 Verifying database setup...");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
  });

  const db = drizzle({ client: pool });

  try {
    // Check if tables exist
    const tables = [
      "users",
      "disposal_locations",
      "events",
      "feedback",
      "stats",
      "sessions",
    ];

    for (const table of tables) {
      try {
        await db.execute(sql`SELECT 1 FROM ${sql.identifier(table)} LIMIT 1`);
        console.log(`✅ Table '${table}' exists`);
      } catch (error) {
        console.log(`❌ Table '${table}' does not exist`);
        return false;
      }
    }

    // Check if admin user exists
    try {
      const adminCheck = await db.execute(
        sql`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`
      );
      const adminCount = Number(adminCheck.rows[0]?.count) || 0;

      if (adminCount > 0) {
        console.log(`✅ Admin user exists (${adminCount} admin(s))`);
      } else {
        console.log("⚠️  No admin users found - run 'npm run db:seed'");
      }
    } catch (error) {
      console.log("⚠️  Could not check admin users");
    }

    console.log("🎉 Database verification completed!");
    return true;
  } catch (error) {
    console.error("❌ Database verification failed:", error);
    return false;
  } finally {
    await pool.end();
  }
}

verifyDatabase()
  .then((success) => {
    if (!success) {
      console.log("\n📋 To fix database issues:");
      console.log("1. Run: npm run db:push");
      console.log("2. Run: npm run db:seed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Verification process failed:", error);
    process.exit(1);
  });
