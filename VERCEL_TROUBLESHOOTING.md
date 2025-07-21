# Vercel Deployment Troubleshooting Guide

## Issue: Login Failed - 500 Server Error with Function Invocation Failed

### Error Pattern

```
Login Failed
500: A server error has occurred FUNCTION_INVOCATION_FAILED bom1::r6fdv-1753134156935-c047e76d8231
```

This error indicates a serverless function failure on Vercel in the Mumbai region (bom1).

## Common Causes and Solutions

### 1. Environment Variables Not Set

**Check in Vercel Dashboard:**

- Go to your project settings → Environment Variables
- Ensure all required variables are set:

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
NODE_ENV=production
```

**Test locally:**

```bash
# Create .env file with your production values
npm run dev
```

### 2. Database Connection Issues

**Symptoms:**

- Function timeouts
- Database connection errors in logs

**Solutions:**

- Verify DATABASE_URL is correct
- Check Neon database is active and not paused
- Ensure database allows connections from Vercel's IP ranges

### 3. Cold Start Timeouts

**Symptoms:**

- Intermittent 500 errors
- Timeouts on first request after inactivity

**Solutions:**

- Implemented connection pooling with timeouts
- Added health check caching
- Optimized database query timeouts

### 4. Build/Deployment Issues

**Check Vercel Build Logs:**

1. Go to Vercel Dashboard → Deployments
2. Click on failed deployment
3. Check build and function logs

**Common issues:**

- Missing dependencies
- TypeScript compilation errors
- Environment variable access issues

## Debugging Steps

### 1. Test Health Endpoint

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-01-22T...",
  "database": "connected",
  "hasJwtSecret": true,
  "hasDatabaseUrl": true
}
```

### 2. Test Debug Endpoint

```bash
curl https://your-app.vercel.app/api/debug
```

### 3. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Navigate to Functions → View Function Logs
3. Look for errors during login attempts

### 4. Test Database Connection

```bash
# Use Neon's SQL Editor or psql
psql "your-database-url"
\dt  # List tables
SELECT * FROM users LIMIT 1;
```

## Recent Improvements Made

### 1. Enhanced Vercel Configuration

- Added Node.js 20 runtime specification
- Increased Lambda size limit
- Improved routing configuration

### 2. Better Error Handling

- Enhanced logging in auth service
- Improved database error reporting
- Added connection timeout handling

### 3. Serverless Optimizations

- Connection pooling with proper limits
- Health check caching
- Timeout handling for cold starts

## Manual Recovery Steps

### 1. Redeploy with Fresh Environment

```bash
# In your project directory
vercel --prod
```

### 2. Reset Database Connection

If database issues persist:

- Check Neon dashboard for connection limits
- Reset connection string if needed
- Verify IP allowlist settings

### 3. Check Admin User Creation

The app tries to create an admin user on startup. If this fails:

- Check ADMIN_EMAIL and ADMIN_PASSWORD are set
- Verify database schema is up to date
- Run database migrations if needed

## Monitoring

### 1. Set up Vercel Analytics

- Enable function analytics in Vercel dashboard
- Monitor error rates and response times

### 2. Regular Health Checks

- Set up external monitoring (e.g., UptimeRobot)
- Monitor `/api/health` endpoint

## Contact Points

If issues persist:

1. Check Vercel Status: https://vercel-status.com/
2. Check Neon Status: https://status.neon.tech/
3. Review recent deployments for changes
4. Test with a minimal reproduction case
