# Fuse16tt API - Postman Collection Guide

## 📦 Files Included

1. **Fuse16tt_API_Collection.postman_collection.json** - Complete API collection with all endpoints
2. **Fuse16tt_Environment.postman_environment.json** - Environment variables for local testing

## 🚀 Quick Start

### Step 1: Import into Postman

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop both JSON files:
   - `Fuse16tt_API_Collection.postman_collection.json`
   - `Fuse16tt_Environment.postman_environment.json`
4. Click **Import**

### Step 2: Select Environment

1. In the top-right corner, click the environment dropdown
2. Select **"Fuse16tt Local Environment"**

### Step 3: Start Your Services

Make sure all backend services are running:

```bash
# Terminal 1 - API Gateway (Port 3000)
cd backend/ApiGateway
npm run dev

# Terminal 2 - User Service (Port 4000)
cd backend/UserService
npm run dev

# Terminal 3 - Article Service (Port 7000)
cd backend/ArticleService
npm run dev

# Terminal 4 - Notification Service (Port 8000)
cd backend/NotificationService
npm run dev
```

### Step 4: Test the APIs

1. Open the **Fuse16tt API Collection** in Postman
2. Start with **Authentication** → **Register User** or **Login**
3. The collection will automatically save your access token
4. Test other endpoints!

## 🔐 Automatic Authentication

### How it Works

The collection includes **automatic token management**:

1. **After Login/Register**: Access token and refresh token are automatically saved
2. **Before Each Request**: Checks if token is expired
3. **Auto-Refresh**: If token expires, automatically refreshes it
4. **Auto-Attach**: Bearer token is automatically added to all authenticated requests

### Scripts Included

#### Global Pre-request Script
- Runs before every request
- Checks token expiration
- Auto-refreshes token if needed (within 1 minute of expiry)

#### Global Test Script
- Logs response status and data
- Helps with debugging

#### Request-Specific Scripts

**Login/Register Test Scripts:**
```javascript
// Automatically saves:
- accessToken
- refreshToken  
- tokenExpiry (current time + 14 minutes)
- userId
```

**Logout Test Script:**
```javascript
// Automatically clears:
- accessToken
- refreshToken
- tokenExpiry
```

## 📚 API Endpoints Overview

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No (requires refresh token) |
| POST | `/auth/logout` | Logout user | No (requires refresh token) |

**Register/Login Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "Lecteur"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### User Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users/me` | Get current user | Yes | Any |
| GET | `/users` | Get all users | Yes | Admin |
| PATCH | `/users/:id/role` | Update user role | Yes | Admin |

**Available Roles:**
- `Admin` - Full access
- `Éditeur` - Can create and edit articles
- `Rédacteur` - Can create articles
- `Lecteur` - Read-only access

### User Statistics (Dashboard)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/summary` | User count summary |
| GET | `/api/v1/users/signups-by-day` | Signups grouped by day |
| GET | `/api/v1/users/by-role` | User count by role |
| GET | `/api/v1/users/active-per-hour` | Active users per hour |
| GET | `/api/v1/users/top-contributors` | Top contributors |

All dashboard endpoints require authentication.

### Article Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/articles` | List articles (paginated) | Yes | Any |
| POST | `/articles` | Create article | Yes | Éditeur/Rédacteur |
| GET | `/articles/:id` | Get article by ID | Yes | Any |
| PATCH | `/articles/:id` | Update article | Yes | Author/Admin |
| DELETE | `/articles/:id` | Delete article | Yes | Admin |

**Create Article Body:**
```json
{
  "title": "Article Title",
  "content": "Article content here...",
  "status": "draft"
}
```

**Article Status Options:**
- `draft` - Not published yet
- `published` - Publicly visible
- `archived` - Hidden from main list

### Article Statistics (Dashboard)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/articles/summary` | Article count summary |
| GET | `/api/v1/articles/count-by-day` | Articles grouped by day |
| GET | `/api/v1/articles/count-by-author` | Articles by author |
| GET | `/api/v1/articles/top-by-comments` | Most commented articles |
| GET | `/api/v1/articles/status-distribution` | Articles by status |

### Comment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/articles/:articleId/comments` | Create comment | Yes |
| GET | `/articles/:articleId/comments` | Get article comments | No |

**Create Comment Body:**
```json
{
  "content": "Your comment here..."
}
```

## 🧪 Testing Workflow

### 1. Register a New User

```
POST /auth/register
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "securePassword123"
}
```

✅ **Auto-saved**: accessToken, refreshToken, userId

### 2. Get Current User Info

```
GET /users/me
```

✅ **Auto-attached**: Bearer token from environment

### 3. Create an Article

```
POST /articles
Body:
{
  "title": "My First Article",
  "content": "Article content...",
  "status": "draft"
}
```

✅ **Auto-saved**: articleId from response

### 4. List Articles

```
GET /articles?page=1&limit=10
```

### 5. Add a Comment

```
POST /articles/{{articleId}}/comments
Body:
{
  "content": "Great article!"
}
```

### 6. Get Dashboard Stats

```
GET /api/v1/users/summary
GET /api/v1/articles/summary
```

### 7. Test Token Refresh

Wait 15 minutes (or manually clear accessToken), then make any authenticated request. The collection will automatically refresh the token!

## 🔧 Environment Variables

The environment includes these variables (automatically managed):

| Variable | Description | Set By |
|----------|-------------|--------|
| `baseUrl` | API Gateway URL (default: http://localhost:3000) | Manual |
| `accessToken` | JWT access token (expires in 15 min) | Auto (Login/Register) |
| `refreshToken` | JWT refresh token (expires in 7 days) | Auto (Login/Register) |
| `tokenExpiry` | Token expiration timestamp | Auto (Login/Register) |
| `userId` | Current user ID | Auto (Login/Register) |
| `articleId` | Last created article ID | Auto (Create Article) |
| `commentId` | Last created comment ID | Auto (Create Comment) |

### Manual Override

You can manually set environment variables:
1. Click the environment dropdown (top-right)
2. Click the eye icon 👁️
3. Edit any variable value

## 🎯 Common Use Cases

### Test Admin Functionality

1. Register a user
2. Use a database tool to change the user's role to `Admin`
3. Login again to get new token with admin privileges
4. Test admin endpoints:
   - GET `/users` - Get all users
   - PATCH `/users/:id/role` - Change user roles
   - DELETE `/articles/:id` - Delete articles

### Test Role-Based Access

1. Create multiple users with different roles
2. Login as each user
3. Test what each role can access:
   - **Lecteur**: Can only read
   - **Rédacteur**: Can create articles
   - **Éditeur**: Can create and edit articles
   - **Admin**: Full access

### Test Pagination

```
GET /articles?page=1&limit=5
GET /articles?page=2&limit=5
GET /articles?status=published
```

### Test Rate Limiting

Rapidly send multiple requests to:
- POST `/auth/login` - Limited to 5 requests per 15 minutes
- POST `/auth/register` - Limited to 3 requests per hour
- POST `/articles` - Limited to 20 requests per 15 minutes

## 🐛 Troubleshooting

### Token Not Being Saved

**Issue**: Access token not saved after login

**Solution**: 
1. Check the **Test** tab in the request
2. Look at **Console** (View → Show Postman Console)
3. Verify the response contains `accessToken`

### 401 Unauthorized Errors

**Issue**: Getting 401 on authenticated requests

**Solutions**:
1. Check if environment is selected (top-right)
2. Verify `accessToken` has a value (click eye icon 👁️)
3. Try logging in again
4. Check if services are running

### Token Not Auto-Refreshing

**Issue**: Token expires but doesn't refresh

**Solutions**:
1. Verify `refreshToken` is set in environment
2. Check **Pre-request Script** in Collection settings
3. Look at Console for refresh errors
4. Manually call POST `/auth/refresh`

### CORS Errors

**Issue**: CORS policy blocking requests

**Solution**: 
- Services should have CORS enabled
- Check backend CORS configuration
- Try using Postman Desktop App (no CORS restrictions)

### Connection Refused

**Issue**: Cannot connect to localhost:3000

**Solution**:
1. Verify API Gateway is running: `cd backend/ApiGateway && npm run dev`
2. Check if port 3000 is available
3. Verify all services are running (ports 3000, 4000, 7000, 8000)

## 📝 Notes

### Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days
- Auto-refresh happens 1 minute before expiry

### Rate Limiting

Different endpoints have different rate limits:
- **Login**: 5 requests per 15 minutes
- **Register**: 3 requests per hour  
- **Write Operations**: 20 requests per 15 minutes

### Cookie-Based Auth

The backend also uses cookies for authentication. Postman handles this automatically.

## 🎉 Tips & Tricks

1. **Use Collection Runner**: Test all endpoints in sequence
   - Click **Runner** button
   - Select Fuse16tt collection
   - Run all requests

2. **Save Responses**: Save successful responses as examples for documentation

3. **Use Variables in Body**: Reference environment variables with `{{variableName}}`

4. **Duplicate Requests**: Right-click → Duplicate to test different scenarios

5. **Organize Tests**: Use folders to group related tests

6. **Share Collection**: Export and share with team members

## 📖 Additional Resources

- [API Examples](./API_EXAMPLES.md)
- [Authentication Changes](./AUTH_CHANGES.md)
- [Dashboard Implementation](./DASHBOARD_IMPLEMENTATION.md)
- [Main README](./readme.md)

## ✅ Quick Verification Checklist

- [ ] Imported both JSON files into Postman
- [ ] Selected "Fuse16tt Local Environment"
- [ ] All backend services running (ports 3000, 4000, 7000, 8000)
- [ ] Successfully registered/logged in
- [ ] Access token automatically saved
- [ ] Can make authenticated requests
- [ ] Token auto-refreshes when expired

---

**Happy Testing! 🚀**

For issues or questions, check the console logs in Postman (View → Show Postman Console).
