# Scientific Waste Map - Vercel Deployment Guide

This is a full-stack React + Express.js application that can be deployed to Vercel.

## Prerequisites

1. **Database**: You'll need a PostgreSQL database. Options include:

   - [Neon](https://neon.tech/) (recommended, has a generous free tier)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Supabase](https://supabase.com/)
   - Any other PostgreSQL provider

2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Deployment Steps

### 1. Set up your database

Choose one of the database providers above and create a PostgreSQL database. Note down your connection string.

### 2. Fork/Clone this repository

Make sure this repository is in your GitHub account.

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Node.js project

#### Option B: Using Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### 4. Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_random_session_secret
JWT_SECRET=your_random_jwt_secret
NODE_ENV=production
```

### 5. Set up the database schema

After deployment, you'll need to push your database schema:

```bash
# Install dependencies locally
npm install

# Set your DATABASE_URL in local .env file
echo "DATABASE_URL=your_postgresql_connection_string" > .env

# Push the schema to your database
npm run db:push
```

### 6. Redeploy

After setting up the database schema, trigger a new deployment in Vercel to ensure everything works properly.

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Install dependencies: `npm install`
4. Push database schema: `npm run db:push`
5. Start development server: `npm run dev`

## Project Structure

- `client/` - React frontend
- `server/` - Express.js backend
- `api/` - Vercel serverless functions
- `shared/` - Shared TypeScript types and database schema
- `dist/` - Built assets (generated)

## Features

- React frontend with TypeScript
- Express.js backend with authentication
- PostgreSQL database with Drizzle ORM
- Session-based authentication
- Interactive map for waste disposal locations
- Admin panel for managing locations
- Responsive design with Tailwind CSS

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with passport.js
- **Deployment**: Vercel (serverless functions)

## Troubleshooting

1. **Database Connection Issues**: Make sure your DATABASE_URL is correct and the database is accessible from Vercel's servers.

2. **Build Errors**: Check that all environment variables are set in Vercel dashboard.

3. **API Routes Not Working**: Ensure the `vercel.json` configuration is correct and your API routes are under `/api/`.

4. **Static Files Not Loading**: The build process should generate files in `dist/public/`. Check the build logs in Vercel.

## Support

For issues specific to this deployment setup, check the Vercel documentation or create an issue in this repository.
