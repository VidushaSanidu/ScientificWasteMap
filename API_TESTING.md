# 🧪 API Testing Guide

## All Available Endpoints

After deployment, you can test these endpoints directly:

### 📊 **Stats Endpoints**

```bash
# Get current stats
curl https://your-app.vercel.app/api/stats

# Update stats (admin)
curl -X PUT https://your-app.vercel.app/api/stats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-jwt-token-123456" \
  -d '{"disposalPoints": 15, "monthlyWaste": "3.2T"}'
```

### 📍 **Disposal Locations**

```bash
# Get all locations
curl https://your-app.vercel.app/api/disposal-locations

# Create new location (admin)
curl -X POST https://your-app.vercel.app/api/disposal-locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-jwt-token-123456" \
  -d '{"name": "Test Location", "latitude": "7.2906", "longitude": "80.6337"}'

# Delete location (admin)
curl -X DELETE https://your-app.vercel.app/api/disposal-locations/123 \
  -H "Authorization: Bearer mock-jwt-token-123456"
```

### 🎉 **Events**

```bash
# Get all events
curl https://your-app.vercel.app/api/events

# Create new event (admin)
curl -X POST https://your-app.vercel.app/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-jwt-token-123456" \
  -d '{"title": "Beach Cleanup", "eventDate": "2025-08-01"}'

# Join event
curl -X POST https://your-app.vercel.app/api/events/123/join \
  -H "Authorization: Bearer mock-jwt-token-123456"

# Delete event (admin)
curl -X DELETE https://your-app.vercel.app/api/events/123 \
  -H "Authorization: Bearer mock-jwt-token-123456"
```

### 💬 **Feedback**

```bash
# Get all feedback (admin)
curl https://your-app.vercel.app/api/feedback \
  -H "Authorization: Bearer mock-jwt-token-123456"

# Submit feedback
curl -X POST https://your-app.vercel.app/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"message": "Great initiative!", "rating": 5}'

# Update feedback status (admin)
curl -X PUT https://your-app.vercel.app/api/feedback/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-jwt-token-123456" \
  -d '{"status": "reviewed", "adminResponse": "Thank you!"}'
```

### 🔐 **Authentication**

```bash
# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Get current user
curl https://your-app.vercel.app/api/auth/user \
  -H "Authorization: Bearer mock-jwt-token-123456"

# Register
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "new@example.com", "password": "password123", "firstName": "John"}'

# Logout
curl -X POST https://your-app.vercel.app/api/auth/logout \
  -H "Authorization: Bearer mock-jwt-token-123456"
```

### ⚕️ **System**

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Legacy login redirect
curl https://your-app.vercel.app/api/login

# Legacy logout redirect
curl https://your-app.vercel.app/api/logout
```

## Expected Responses

All endpoints return JSON responses with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `401` - Unauthorized
- `404` - Not Found

Mock data is returned for all endpoints to ensure the frontend works correctly without a database.
