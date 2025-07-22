#!/bin/bash

echo "🚀 ScientificWasteMap Production Deployment Setup"
echo "================================================"

# Check if environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set it in your Vercel project settings"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET environment variable is not set"
    echo "Please set it in your Vercel project settings"
    exit 1
fi

echo "✅ Environment variables are set"

echo "📦 Installing dependencies..."
npm install

echo "🗃️ Generating database migrations..."
npx drizzle-kit generate

echo "🔄 Pushing schema to database..."
npx drizzle-kit push

echo "🌱 Seeding database with initial data..."
npm run db:seed

echo "✅ Database setup completed successfully!"
echo ""
echo "📋 What was done:"
echo "- Generated SQL migrations"
echo "- Created all database tables"
echo "- Added admin user and initial stats"
echo ""
echo "🎉 Your ScientificWasteMap is ready for production!"
