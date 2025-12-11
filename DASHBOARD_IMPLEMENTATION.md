# Dashboard Statistics Implementation

This document describes the complete implementation of the dashboard statistics system that integrates data from ArticleService and UserService microservices.

## Overview

The dashboard provides real-time analytics and visualizations for:
- Article statistics (total, published, drafts, activity over time)
- User statistics (total users, signups, activity, role distribution)
- Article engagement metrics (top articles by comments)
- Time-series data for trends analysis

## Backend API Endpoints

### ArticleService Endpoints

Base URL: `http://localhost:3002` (or your API Gateway)

#### 1. GET `/api/v1/articles/summary`
**Purpose:** High-level article metrics

**Authentication:** Required

**Response:**
```json
{
  "total": 1241,
  "published": 1024,
  "drafts": 117,
  "averageReadTimeMinutes": 6.4
}
```

**TypeScript Interface:**
```typescript
interface ArticleSummary {
  total: number;
  published: number;
  drafts: number;
  averageReadTimeMinutes: number;
}
```

---

#### 2. GET `/api/v1/articles/count-by-day?days=30`
**Purpose:** Time-series data for articles created per day

**Authentication:** Required

**Query Parameters:**
- `days` (optional, default: 30): Number of days to retrieve

**Response:**
```json
{
  "days": ["2025-11-12", "2025-11-13", "2025-11-14", "..."],
  "counts": [4, 6, 3, 8, "..."]
}
```

**TypeScript Interface:**
```typescript
interface ArticleCountByDay {
  days: string[];
  counts: number[];
}
```

---

#### 3. GET `/api/v1/articles/count-by-author`
**Purpose:** Article count grouped by author for bar charts

**Authentication:** Required

**Response:**
```json
[
  {
    "authorId": "u_1",
    "authorName": "Alice",
    "count": 120
  },
  {
    "authorId": "u_17",
    "authorName": "Bob",
    "count": 98
  }
]
```

**TypeScript Interface:**
```typescript
interface ArticleByAuthor {
  authorId: string;
  authorName: string;
  count: number;
}
```

---

#### 4. GET `/api/v1/articles/top-by-comments?limit=10`
**Purpose:** Top articles ranked by comment count

**Authentication:** Required

**Query Parameters:**
- `limit` (optional, default: 10): Number of top articles to return

**Response:**
```json
[
  {
    "articleId": "a_100",
    "title": "Best CSS Tips",
    "comments": 231,
    "views": 5400
  }
]
```

**TypeScript Interface:**
```typescript
interface TopArticleByComments {
  articleId: string;
  title: string;
  comments: number;
  views: number;
}
```

---

#### 5. GET `/api/v1/articles/status-distribution`
**Purpose:** Article count by status for pie/donut charts

**Authentication:** Required

**Response:**
```json
[
  { "status": "published", "count": 1024 },
  { "status": "draft", "count": 117 },
  { "status": "archived", "count": 100 }
]
```

**TypeScript Interface:**
```typescript
interface ArticleStatusDistribution {
  status: string;
  count: number;
}
```

---

### UserService Endpoints

Base URL: `http://localhost:3001` (or your API Gateway)

#### 1. GET `/api/v1/users/summary`
**Purpose:** High-level user statistics

**Authentication:** Required

**Response:**
```json
{
  "total": 5320,
  "activeLast30Days": 823,
  "newLast30Days": 102
}
```

**TypeScript Interface:**
```typescript
interface UserSummary {
  total: number;
  activeLast30Days: number;
  newLast30Days: number;
}
```

---

#### 2. GET `/api/v1/users/signups-by-day?days=30`
**Purpose:** Time-series data for user signups

**Authentication:** Required

**Query Parameters:**
- `days` (optional, default: 30): Number of days to retrieve

**Response:**
```json
{
  "days": ["2025-11-12", "2025-11-13", "..."],
  "counts": [14, 8, 12, "..."]
}
```

**TypeScript Interface:**
```typescript
interface SignupsByDay {
  days: string[];
  counts: number[];
}
```

---

#### 3. GET `/api/v1/users/by-role`
**Purpose:** User count grouped by role for pie/donut charts

**Authentication:** Required

**Response:**
```json
[
  { "role": "Admin", "count": 12 },
  { "role": "Éditeur", "count": 52 },
  { "role": "Rédacteur", "count": 234 },
  { "role": "Lecteur", "count": 5022 }
]
```

**TypeScript Interface:**
```typescript
interface UsersByRole {
  role: string;
  count: number;
}
```

---

#### 4. GET `/api/v1/users/active-per-hour?hours=24`
**Purpose:** User activity per hour for the last 24 hours

**Authentication:** Required

**Query Parameters:**
- `hours` (optional, default: 24): Number of hours to retrieve

**Response:**
```json
{
  "hours": ["00:00", "01:00", "02:00", "..."],
  "counts": [3, 5, 2, 8, "..."]
}
```

**TypeScript Interface:**
```typescript
interface ActivePerHour {
  hours: string[];
  counts: number[];
}
```

---

#### 5. GET `/api/v1/users/top-contributors?limit=10`
**Purpose:** Top contributors by article and comment count

**Authentication:** Required

**Query Parameters:**
- `limit` (optional, default: 10): Number of contributors to return

**Response:**
```json
[
  {
    "userId": "u_3",
    "name": "Charlie",
    "articles": 54,
    "comments": 320
  }
]
```

**TypeScript Interface:**
```typescript
interface TopContributor {
  userId: string;
  name: string;
  articles: number;
  comments: number;
}
```

---

## Frontend Integration

### Service Layer

The `ProjectService` handles all API calls and data transformation:

**Location:** `frontend/src/app/modules/admin/dashboards/project/project.service.ts`

**Key Methods:**

```typescript
// Fetch all dashboard data in parallel
getDashboardData(): Observable<DashboardData>

// Transform API data to chart-compatible format
private _transformToChartData(data: DashboardData): any
```

### Component Integration

**Location:** `frontend/src/app/modules/admin/dashboards/project/project.component.ts`

The component automatically:
1. Attempts to load real data from backend APIs
2. Falls back to mock data if APIs are unavailable
3. Transforms data for ApexCharts visualization

### Dashboard Visualizations

#### Summary Cards
- **Total Articles**: Displays total article count with published articles
- **Draft Articles**: Shows draft count with average read time
- **Total Users**: Displays total users with 30-day active count
- **New Users**: Shows new signups in last 30 days with growth rate

#### Charts
- **Article Activity Summary**: Line chart showing articles created over time
- **Article Status Distribution**: Polar area chart showing article distribution by status
- **Top Articles by Engagement**: List of most commented articles

## Configuration

### API Base URLs

Update the API base URLs in `project.service.ts`:

```typescript
private readonly articleApiBase = 'http://localhost:3002/api/v1/articles';
private readonly userApiBase = 'http://localhost:3001/api/v1/users';
```

For production, use environment variables:

```typescript
private readonly articleApiBase = environment.articleApiUrl;
private readonly userApiBase = environment.userApiUrl;
```

### CORS Configuration

Ensure your backend services allow CORS requests from your frontend origin:

```typescript
// Example for Express.js
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## Data Flow

```
┌─────────────────┐
│  Dashboard UI   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ProjectService  │──┐
└────────┬────────┘  │
         │           │ Parallel API Calls
         ▼           │
┌─────────────────┐  │
│   forkJoin()    │◄─┘
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌───────┐
│Article │ │ User  │
│Service │ │Service│
└────────┘ └───────┘
```

## Chart Components

The dashboard uses **ApexCharts** (ng-apexcharts) for visualizations:

### Line Chart (Article Activity)
```typescript
chartGithubIssues: ApexOptions = {
  chart: { type: 'line' },
  series: [...],
  xaxis: { categories: data.days },
  // ... more config
}
```

### Polar Area Chart (Status Distribution)
```typescript
chartTaskDistribution: ApexOptions = {
  chart: { type: 'polarArea' },
  series: data.counts,
  labels: data.labels,
  // ... more config
}
```

## Error Handling

The implementation includes graceful error handling:

1. **API Failures**: Falls back to mock data
2. **Missing Data**: Uses default values (0, empty arrays)
3. **Network Issues**: Displays console warnings and maintains UI functionality

## Testing

### Backend Testing

Test each endpoint using curl or Postman:

```bash
# Test article summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3002/api/v1/articles/summary

# Test user summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/v1/users/summary
```

### Frontend Testing

1. Start the backend services
2. Run the Angular development server: `npm run start`
3. Navigate to `/dashboards/project`
4. Check browser console for any API errors
5. Verify charts display real data

## Performance Considerations

### Caching
The ArticleService implements Redis caching for:
- Article summaries
- List queries
- Individual articles

Cache TTL: 3600 seconds (1 hour)

### Optimization Tips
1. Use pagination for large datasets
2. Implement server-side filtering
3. Cache dashboard data in frontend service
4. Use lazy loading for heavy charts
5. Consider WebSocket for real-time updates

## Future Enhancements

1. **Real-time Updates**: Add WebSocket support for live data
2. **Date Range Filters**: Allow users to select custom date ranges
3. **Export Functionality**: Add CSV/PDF export for reports
4. **Custom Dashboards**: Let users create custom dashboard layouts
5. **Alerts**: Add threshold-based notifications
6. **Drill-down**: Link charts to detailed views

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem:** Browser blocks API requests

**Solution:** Configure CORS in backend services
```typescript
app.use(cors({ origin: 'http://localhost:4200' }));
```

#### 2. Authentication Errors
**Problem:** 401 Unauthorized responses

**Solution:** Ensure JWT tokens are properly sent in headers
```typescript
// Add interceptor to include auth header
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = this.authService.getToken();
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
  return next.handle(authReq);
}
```

#### 3. Empty Dashboard
**Problem:** Dashboard shows no data

**Solution:** 
- Check backend services are running
- Verify API URLs in `project.service.ts`
- Check browser console for errors
- Verify authentication tokens are valid

#### 4. Charts Not Rendering
**Problem:** Chart areas are blank

**Solution:**
- Verify ApexCharts is installed: `npm install ng-apexcharts apexcharts`
- Check data structure matches chart expectations
- Inspect browser console for chart errors

## Dependencies

### Backend
- Express.js
- Mongoose (MongoDB)
- Redis (for caching)
- express-validator
- bcryptjs
- jsonwebtoken

### Frontend
- Angular 18
- ng-apexcharts
- RxJS
- Angular Material
- Tailwind CSS

## Deployment Checklist

- [ ] Update API base URLs for production
- [ ] Configure environment variables
- [ ] Enable CORS for production domain
- [ ] Set up Redis for caching
- [ ] Configure authentication/authorization
- [ ] Test all endpoints with production data
- [ ] Optimize bundle size
- [ ] Enable production mode in Angular
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint responses
3. Check browser console for errors
4. Verify backend services are running
5. Ensure database connections are active

---

**Last Updated:** December 11, 2025  
**Version:** 1.0.0
