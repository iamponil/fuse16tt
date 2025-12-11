# Dashboard API Examples & Sample Responses

Quick reference guide for all dashboard API endpoints with sample requests and responses.

## ArticleService APIs

### 1. Article Summary
```http
GET /api/v1/articles/summary
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "total": 1241,
  "published": 1024,
  "drafts": 117,
  "averageReadTimeMinutes": 6.4
}
```

---

### 2. Articles Count by Day
```http
GET /api/v1/articles/count-by-day?days=30
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "days": [
    "2025-11-12",
    "2025-11-13",
    "2025-11-14",
    "2025-11-15",
    "2025-11-16",
    "2025-11-17",
    "2025-11-18"
  ],
  "counts": [4, 6, 3, 8, 12, 5, 9]
}
```

**With 7 days:**
```http
GET /api/v1/articles/count-by-day?days=7
```

---

### 3. Articles Count by Author
```http
GET /api/v1/articles/count-by-author
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "authorId": "507f1f77bcf86cd799439011",
    "authorName": "Alice Johnson",
    "count": 120
  },
  {
    "authorId": "507f1f77bcf86cd799439012",
    "authorName": "Bob Smith",
    "count": 98
  },
  {
    "authorId": "507f1f77bcf86cd799439013",
    "authorName": "Charlie Brown",
    "count": 85
  },
  {
    "authorId": "507f1f77bcf86cd799439014",
    "authorName": "Diana Prince",
    "count": 72
  }
]
```

---

### 4. Top Articles by Comments
```http
GET /api/v1/articles/top-by-comments?limit=10
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "articleId": "507f1f77bcf86cd799439100",
    "title": "Best CSS Tips for Modern Web Development",
    "comments": 231,
    "views": 5400
  },
  {
    "articleId": "507f1f77bcf86cd799439101",
    "title": "Understanding React Hooks in Depth",
    "comments": 198,
    "views": 4850
  },
  {
    "articleId": "507f1f77bcf86cd799439102",
    "title": "TypeScript Best Practices Guide",
    "comments": 176,
    "views": 4200
  },
  {
    "articleId": "507f1f77bcf86cd799439103",
    "title": "Node.js Performance Optimization",
    "comments": 142,
    "views": 3800
  }
]
```

**With custom limit:**
```http
GET /api/v1/articles/top-by-comments?limit=5
```

---

### 5. Article Status Distribution
```http
GET /api/v1/articles/status-distribution
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "status": "published",
    "count": 1024
  },
  {
    "status": "draft",
    "count": 117
  },
  {
    "status": "archived",
    "count": 100
  }
]
```

---

## UserService APIs

### 1. User Summary
```http
GET /api/v1/users/summary
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "total": 5320,
  "activeLast30Days": 823,
  "newLast30Days": 102
}
```

---

### 2. User Signups by Day
```http
GET /api/v1/users/signups-by-day?days=30
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "days": [
    "2025-11-12",
    "2025-11-13",
    "2025-11-14",
    "2025-11-15",
    "2025-11-16",
    "2025-11-17",
    "2025-11-18"
  ],
  "counts": [14, 8, 12, 16, 11, 9, 15]
}
```

**With 7 days:**
```http
GET /api/v1/users/signups-by-day?days=7
```

---

### 3. Users by Role
```http
GET /api/v1/users/by-role
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "role": "Lecteur",
    "count": 5022
  },
  {
    "role": "Rédacteur",
    "count": 234
  },
  {
    "role": "Éditeur",
    "count": 52
  },
  {
    "role": "Admin",
    "count": 12
  }
]
```

---

### 4. Active Users per Hour
```http
GET /api/v1/users/active-per-hour?hours=24
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "hours": [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ],
  "counts": [
    3, 2, 1, 0, 1, 4,
    12, 28, 45, 67, 89, 102,
    94, 87, 76, 65, 58, 52,
    48, 42, 35, 28, 18, 8
  ]
}
```

**With 12 hours:**
```http
GET /api/v1/users/active-per-hour?hours=12
```

---

### 5. Top Contributors
```http
GET /api/v1/users/top-contributors?limit=10
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "userId": "507f1f77bcf86cd799439021",
    "name": "Charlie Wilson",
    "articles": 54,
    "comments": 320
  },
  {
    "userId": "507f1f77bcf86cd799439022",
    "name": "Diana Martinez",
    "articles": 48,
    "comments": 285
  },
  {
    "userId": "507f1f77bcf86cd799439023",
    "name": "Eve Anderson",
    "articles": 42,
    "comments": 267
  },
  {
    "userId": "507f1f77bcf86cd799439024",
    "name": "Frank Thomas",
    "articles": 38,
    "comments": 241
  }
]
```

**With custom limit:**
```http
GET /api/v1/users/top-contributors?limit=5
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Not authenticated"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "days",
      "location": "query"
    }
  ]
}
```

---

## cURL Examples

### Article Summary
```bash
curl -X GET "http://localhost:3002/api/v1/articles/summary" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Articles by Day (Last 7 days)
```bash
curl -X GET "http://localhost:3002/api/v1/articles/count-by-day?days=7" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### User Summary
```bash
curl -X GET "http://localhost:3001/api/v1/users/summary" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Top Contributors (Top 5)
```bash
curl -X GET "http://localhost:3001/api/v1/users/top-contributors?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Postman Collection

Import this JSON to test all endpoints:

```json
{
  "info": {
    "name": "Dashboard APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "ArticleService",
      "item": [
        {
          "name": "Article Summary",
          "request": {
            "method": "GET",
            "url": "{{article_base_url}}/api/v1/articles/summary"
          }
        },
        {
          "name": "Count by Day",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{article_base_url}}/api/v1/articles/count-by-day?days=30",
              "query": [
                {
                  "key": "days",
                  "value": "30"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "UserService",
      "item": [
        {
          "name": "User Summary",
          "request": {
            "method": "GET",
            "url": "{{user_base_url}}/api/v1/users/summary"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "article_base_url",
      "value": "http://localhost:3002"
    },
    {
      "key": "user_base_url",
      "value": "http://localhost:3001"
    },
    {
      "key": "jwt_token",
      "value": "your_jwt_token_here"
    }
  ]
}
```

---

## Rate Limiting

All endpoints respect rate limiting:
- **Read endpoints**: 100 requests per 15 minutes
- **Write endpoints**: 20 requests per 15 minutes

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1670000000
```

---

## Pagination (Future Enhancement)

For endpoints that may return large datasets, consider adding pagination:

```http
GET /api/v1/articles/count-by-author?page=1&limit=20
```

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

---

**Last Updated:** December 11, 2025  
**API Version:** 1.0.0
