# 🚨 DATABASE SETUP REQUIRED FOR PRODUCTION

## Error Fixed: "relation 'feedback' does not exist"

This error occurs because the database tables haven't been created in your production database yet.

## 🔧 Quick Fix Steps:

### Option 1: Use Vercel CLI (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Link your project: `vercel link`
4. Set up environment variables:
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   ```
5. Run the setup script:
   ```bash
   ./scripts/setup-production-db.sh
   ```

### Option 2: Manual Database Setup

1. **Set Environment Variables in Vercel Dashboard:**

   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: A secure random string

2. **Push Database Schema:**

   ```bash
   # Generate migrations
   npx drizzle-kit generate

   # Push to production database
   npx drizzle-kit push

   # Seed with initial data
   npm run db:seed
   ```

3. **Redeploy your application:**
   ```bash
   git add .
   git commit -m "Add database migrations"
   git push
   ```

## 📋 What These Commands Do:

- `drizzle-kit generate`: Creates SQL migration files
- `drizzle-kit push`: Applies schema changes to your database
- `npm run db:seed`: Creates admin user and initial stats

## 🗃️ Database Tables Created:

- `users` - User authentication and profiles
- `disposal_locations` - Waste disposal points
- `events` - Community events
- `feedback` - User feedback and reports
- `stats` - System statistics
- `sessions` - Session management

## 🔐 Default Admin User:

After seeding, you can login with:

- **Email**: `admin@uop.ac.lk` (or your ADMIN_EMAIL env var)
- **Password**: `admin123` (or your ADMIN_PASSWORD env var)

## ✅ Verification:

After setup, your API endpoints will work with real data:

- Authentication will use real user accounts
- All CRUD operations will persist to PostgreSQL
- Admin features will be functional

## 🎉 Once Complete:

Your ScientificWasteMap will be fully functional with real database operations!
