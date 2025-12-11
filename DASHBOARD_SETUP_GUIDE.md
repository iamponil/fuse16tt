# Dashboard Setup & Testing Guide

Quick guide to set up and test the dashboard statistics implementation.

## Prerequisites

- Node.js (v16+)
- MongoDB running
- Redis running (for caching)
- All backend services started

## Quick Start (5 Minutes)

### 1. Start Backend Services

#### ArticleService
```bash
cd backend/ArticleService
npm install  # if not already done
npm start    # or npm run dev
```

Service should be running on: `http://localhost:3002`

#### UserService
```bash
cd backend/UserService
npm install  # if not already done
npm start    # or npm run dev
```

Service should be running on: `http://localhost:3001`

#### Verify Services
```bash
# Test ArticleService
curl http://localhost:3002

# Test UserService
curl http://localhost:3001
```

---

### 2. Configure Frontend

Update API URLs in `frontend/src/app/modules/admin/dashboards/project/project.service.ts`:

```typescript
private readonly articleApiBase = 'http://localhost:3002/api/v1/articles';
private readonly userApiBase = 'http://localhost:3001/api/v1/users';
```

If using API Gateway, update to:
```typescript
private readonly articleApiBase = 'http://localhost:3000/articles/api/v1/articles';
private readonly userApiBase = 'http://localhost:3000/users/api/v1/users';
```

---

### 3. Start Frontend

```bash
cd frontend
npm install  # if not already done
npm run start
```

Frontend should be running on: `http://localhost:4200`

---

### 4. Access Dashboard

1. Open browser: `http://localhost:4200`
2. Login with your credentials
3. Navigate to: **Dashboards → Project**

---

## Testing the Implementation

### Step 1: Test Backend Endpoints

#### Get JWT Token First
```bash
# Login to get token
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Save the `accessToken` from response.

#### Test Article Endpoints
```bash
TOKEN="your_access_token_here"

# Article summary
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/api/v1/articles/summary

# Articles by day
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3002/api/v1/articles/count-by-day?days=30"

# Articles by author
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/api/v1/articles/count-by-author

# Top articles
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3002/api/v1/articles/top-by-comments?limit=10"

# Status distribution
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/api/v1/articles/status-distribution
```

#### Test User Endpoints
```bash
# User summary
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/v1/users/summary

# Signups by day
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/v1/users/signups-by-day?days=30"

# Users by role
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/v1/users/by-role

# Active per hour
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/v1/users/active-per-hour?hours=24"

# Top contributors
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/v1/users/top-contributors?limit=10"
```

### Step 2: Test Frontend Integration

1. **Open Browser Console** (F12)
2. Navigate to Dashboard
3. Check for API calls in Network tab
4. Look for any errors in Console tab

Expected network requests:
- `/api/v1/articles/summary`
- `/api/v1/articles/count-by-day`
- `/api/v1/articles/count-by-author`
- `/api/v1/articles/top-by-comments`
- `/api/v1/articles/status-distribution`
- `/api/v1/users/summary`
- `/api/v1/users/signups-by-day`
- `/api/v1/users/by-role`
- `/api/v1/users/active-per-hour`
- `/api/v1/users/top-contributors`

### Step 3: Verify Dashboard Display

Check that dashboard shows:
- ✅ Total Articles count
- ✅ Draft Articles count
- ✅ Total Users count
- ✅ New Users count
- ✅ Article Activity Chart
- ✅ Article Status Distribution Chart
- ✅ Top Articles List

---

## Troubleshooting

### Issue: Dashboard Shows No Data

**Check:**
1. Backend services are running
2. MongoDB is running and populated with data
3. JWT token is valid
4. CORS is configured correctly

**Solution:**
```bash
# Check if services are running
lsof -i :3001  # UserService
lsof -i :3002  # ArticleService
lsof -i :4200  # Frontend

# Check MongoDB
mongosh
> use articledb  # or your database name
> db.articles.count()
> db.users.count()
```

### Issue: CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:** Add CORS middleware to backend services

**ArticleService (backend/ArticleService/src/server.ts):**
```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

**UserService (backend/UserService/src/server.ts):**
```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Issue: 401 Unauthorized

**Error:** All API calls return 401

**Solution:** Check authentication

1. Verify JWT token is being sent:
```typescript
// Check browser console → Network → Request Headers
Authorization: Bearer eyJhbGc...
```

2. Create HTTP Interceptor if missing:

**frontend/src/app/core/auth/auth.interceptor.ts:**
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### Issue: Charts Not Displaying

**Error:** Chart areas are blank

**Solution:**
1. Verify ApexCharts is installed:
```bash
cd frontend
npm install ng-apexcharts apexcharts
```

2. Check imports in component:
```typescript
import { NgApexchartsModule } from 'ng-apexcharts';
```

3. Verify data structure:
```typescript
console.log(this.data);  // Should have chart data
```

### Issue: Redis Connection Error

**Error:** `Redis connection failed`

**Solution:**
1. Start Redis:
```bash
# macOS (Homebrew)
brew services start redis

# Linux
sudo systemctl start redis

# Check if running
redis-cli ping  # Should return PONG
```

2. If Redis is optional, update code to handle failures gracefully (already implemented).

---

## Seeding Test Data

To test with sample data, create seed scripts:

### Seed Articles
```bash
cd backend/ArticleService
node scripts/seed-articles.js
```

**scripts/seed-articles.js:**
```javascript
const mongoose = require('mongoose');
const Article = require('../src/models/Article').default;

mongoose.connect('mongodb://localhost:27017/articledb');

async function seed() {
  const articles = [];
  for (let i = 0; i < 100; i++) {
    articles.push({
      title: `Article ${i + 1}`,
      content: `Content for article ${i + 1}. `.repeat(100),
      tags: ['tech', 'tutorial'],
      author: '507f1f77bcf86cd799439011',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
  }
  
  await Article.insertMany(articles);
  console.log('✅ Seeded 100 articles');
  process.exit(0);
}

seed();
```

### Seed Users
```bash
cd backend/UserService
node scripts/seed-users.js
```

**scripts/seed-users.js:**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User').default;

mongoose.connect('mongodb://localhost:27017/userdb');

async function seed() {
  const roles = ['Admin', 'Éditeur', 'Rédacteur', 'Lecteur'];
  const users = [];
  
  for (let i = 0; i < 50; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    users.push({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: hashedPassword,
      role: roles[Math.floor(Math.random() * roles.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
  }
  
  await User.insertMany(users);
  console.log('✅ Seeded 50 users');
  process.exit(0);
}

seed();
```

---

## Production Deployment

### 1. Environment Variables

**ArticleService (.env):**
```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb://your-production-db/articledb
REDIS_URL=redis://your-redis-server:6379
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

**UserService (.env):**
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://your-production-db/userdb
REDIS_URL=redis://your-redis-server:6379
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Build Frontend

```bash
cd frontend
npm run build --prod
```

### 3. Update Frontend Config

**frontend/src/environments/environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  articleApiUrl: 'https://api.yourdomain.com/articles/api/v1/articles',
  userApiUrl: 'https://api.yourdomain.com/users/api/v1/users'
};
```

### 4. Deploy

- Use Docker for containerization
- Set up reverse proxy (Nginx)
- Enable HTTPS
- Configure rate limiting
- Set up monitoring (PM2, New Relic, etc.)

---

## Performance Checklist

- [ ] Redis caching enabled
- [ ] Database indexes created
- [ ] GZIP compression enabled
- [ ] CDN for static assets
- [ ] API rate limiting configured
- [ ] MongoDB connection pooling
- [ ] Frontend lazy loading
- [ ] Image optimization
- [ ] Bundle size optimization

---

## Next Steps

1. ✅ Complete setup and testing
2. ✅ Seed database with test data
3. ✅ Verify all endpoints work
4. ✅ Check frontend displays correctly
5. 📊 Add custom metrics
6. 📈 Implement real-time updates
7. 📱 Add mobile responsiveness
8. 🔔 Set up alerts and notifications

---

## Support Resources

- **Documentation:** `DASHBOARD_IMPLEMENTATION.md`
- **API Examples:** `API_EXAMPLES.md`
- **TypeScript Interfaces:** `frontend/src/app/modules/admin/dashboards/project/project.types.ts`

---

**Setup Time:** ~5-10 minutes  
**Last Updated:** December 11, 2025
