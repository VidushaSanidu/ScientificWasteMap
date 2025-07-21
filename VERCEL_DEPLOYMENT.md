# Deploying to Vercel

This guide will help you deploy your Scientific Waste Map application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A Neon database (or another PostgreSQL database)

## Step 1: Prepare Your Project

The project is already configured for Vercel deployment with the following files:

- `vercel.json` - Vercel deployment configuration
- `.env.example` - Environment variables template

## Step 2: Set Up Environment Variables

In your Vercel dashboard, you'll need to configure the following environment variables:

### Required Variables:

- `DATABASE_URL` - Your Neon database connection string
- `SESSION_SECRET` - A secure random string for session encryption
- `NODE_ENV` - Set to "production"

### Optional Variables (if using Replit Auth):

- `REPLIT_CLIENT_ID` - Your Replit OAuth client ID
- `REPLIT_CLIENT_SECRET` - Your Replit OAuth client secret

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables in the dashboard
5. Deploy!

### Option B: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. In your project directory: `vercel`
4. Follow the prompts:
   - Link to existing project? **N**
   - What's your project's name? **scientific-waste-map** (or your preferred name)
   - In which directory is your code located? **./**
   - Want to modify settings? **N** (our vercel.json handles the config)
5. Set environment variables:
   ```bash
   vercel env add DATABASE_URL
   vercel env add SESSION_SECRET
   vercel env add NODE_ENV
   ```
6. Deploy to production: `vercel --prod`

## Step 4: Database Setup

1. Ensure your Neon database is set up and accessible
2. Run database migrations if needed:
   ```bash
   npm run db:push
   ```

## Step 5: Verify Deployment

After deployment:

1. Check that your frontend loads correctly
2. Verify API endpoints are working (`/api/...`)
3. Test database connectivity
4. Check authentication flow (if using Replit Auth)

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Database Connection**: Verify your `DATABASE_URL` is correct
3. **Environment Variables**: Ensure all required variables are set
4. **API Routes**: Check that `/api/*` routes are working

### Build Configuration

The project uses:

- Vite for frontend builds
- esbuild for server bundling
- Vercel's Node.js runtime for serverless functions

## Custom Domain (Optional)

To use a custom domain:

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring

Vercel provides built-in analytics and monitoring:

- Function logs in the dashboard
- Performance metrics
- Error tracking

Your application should now be live on Vercel! 🎉
