import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { users, stats } from "../shared/schema.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Neon for serverless
neonConfig.poolQueryViaFetch = true;

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const db = drizzle({ client: pool, schema: { users, stats } });

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@uop.ac.lk";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await db.insert(users).values({
        id: "admin-" + Date.now(),
        email: adminEmail,
        password: hashedPassword,
        firstName: "System",
        lastName: "Administrator",
        role: "admin",
        isEmailVerified: true,
      });

      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    }

    // Create initial stats if they don't exist
    const existingStats = await db.select().from(stats).limit(1);

    if (existingStats.length === 0) {
      await db.insert(stats).values({
        disposalPoints: 0,
        monthlyWaste: "0T",
        recyclableRate: "0%",
        activeUsers: "1",
      });

      console.log("✅ Initial stats created");
    } else {
      console.log("ℹ️  Stats already exist");
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedDatabase().catch((error) => {
  console.error("Seeding process failed:", error);
  process.exit(1);
});
