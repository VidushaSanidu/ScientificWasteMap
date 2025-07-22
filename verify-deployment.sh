#!/bin/bash

echo "🚀 Vercel Deployment Verification"
echo "=================================="

echo "✅ Checking TypeScript compilation..."
npm run check
if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed"
    exit 1
fi

echo ""
echo "✅ Checking build process..."
npm run vercel-build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Checking API file exists..."
if [ -f "api/simple.ts" ]; then
    echo "✅ API file found: api/simple.ts"
else
    echo "❌ API file missing"
    exit 1
fi

echo ""
echo "✅ Checking vercel.json configuration..."
if [ -f "vercel.json" ]; then
    echo "✅ Vercel config found"
else
    echo "❌ Vercel config missing"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Fix deployment with simplified API'"
echo "3. git push"
echo "4. Deploy to Vercel"
echo ""
echo "🔗 API endpoints that will be available:"
echo "- /api/health"
echo "- /api/stats"
echo "- /api/disposal-locations"
echo "- /api/events"
echo "- /api/feedback"
echo "- /api/auth/login (POST)"
echo "- /api/auth/register (POST)"
echo "- /api/auth/logout (POST)"
