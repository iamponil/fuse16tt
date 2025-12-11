# 📮 Fuse16tt Postman Collection - Complete Package

This package provides a **complete, production-ready Postman collection** for testing the Fuse16tt API with **automatic authentication handling**, comprehensive test coverage, and CLI automation.

---

## 📦 What's Included

### 1. **Postman Collection** 
`Fuse16tt_API_Collection.postman_collection.json`

Complete API collection with:
- ✅ **40+ API endpoints** organized in folders
- ✅ **Automatic token management** (login once, use everywhere)
- ✅ **Auto-refresh tokens** (never manually refresh)
- ✅ **Pre-request scripts** (token validation & refresh)
- ✅ **Test scripts** (response validation)
- ✅ **Environment variable management** (auto-save IDs and tokens)

### 2. **Environment File**
`Fuse16tt_Environment.postman_environment.json`

Pre-configured environment with:
- Base URL (localhost:3000)
- Access token (auto-managed)
- Refresh token (auto-managed)
- User ID, Article ID, Comment ID (auto-saved)
- Token expiry tracking

### 3. **Automated Test Runner**
`run-api-tests.sh`

Bash script for CLI testing:
- ✅ Checks if services are running
- ✅ Runs Newman (Postman CLI)
- ✅ Generates HTML reports
- ✅ Perfect for CI/CD pipelines

### 4. **Comprehensive Documentation**

| File | Purpose |
|------|---------|
| `POSTMAN_QUICK_START.md` | 60-second quick start guide |
| `POSTMAN_GUIDE.md` | Complete user manual (all features) |
| `POSTMAN_TEST_SCENARIOS.md` | 30+ test scenarios with expected results |
| `POSTMAN_COLLECTION_README.md` | This file (overview) |

---

## 🎯 Key Features

### 🔐 Automatic Authentication

**No manual token copying!** The collection handles everything:

1. **Login/Register** → Automatically saves `accessToken` + `refreshToken`
2. **Every Request** → Automatically attaches Bearer token
3. **Token Expiring?** → Automatically refreshes before expiry (1 min buffer)
4. **Logout** → Automatically clears all tokens

**You just login once and test for hours!**

### 📊 Complete API Coverage

**Authentication** (4 endpoints)
- Register, Login, Refresh, Logout

**Users** (3 endpoints)
- Get current user, Get all users, Update role

**User Statistics** (5 endpoints)
- Summary, Signups by day, By role, Active per hour, Top contributors

**Articles** (5 endpoints)
- List, Create, Get by ID, Update, Delete

**Article Statistics** (5 endpoints)
- Summary, Count by day, By author, Top by comments, Status distribution

**Comments** (2 endpoints)
- Create comment, Get article comments

**Total: 24+ unique endpoints** with variants and parameters

### ✅ Built-in Test Validation

Every request includes test scripts:

```javascript
// Example: Login test
pm.test('Login successful', function () {
    pm.response.to.have.status(200);
    pm.expect(jsonData).to.have.property('accessToken');
    pm.expect(jsonData).to.have.property('refreshToken');
});
```

### 🔄 Smart Variable Management

Automatically saves and reuses:
- `{{accessToken}}` - Current access token
- `{{refreshToken}}` - Current refresh token
- `{{userId}}` - Last registered/logged in user
- `{{articleId}}` - Last created article
- `{{commentId}}` - Last created comment

---

## 🚀 Getting Started

### Step 1: Import (30 seconds)

1. Open Postman Desktop
2. Click **Import**
3. Drag both files:
   - `Fuse16tt_API_Collection.postman_collection.json`
   - `Fuse16tt_Environment.postman_environment.json`
4. Select **"Fuse16tt Local Environment"** (top-right)

### Step 2: Start Services

```bash
# Terminal 1
cd backend/ApiGateway && npm run dev

# Terminal 2
cd backend/UserService && npm run dev

# Terminal 3
cd backend/ArticleService && npm run dev
```

### Step 3: Test!

1. **Authentication** → **Register User** → Send
2. **Users** → **Get Current User** → Send
3. **Articles** → **Create Article** → Send

✅ Done! Token is now attached to all requests.

---

## 📚 Usage Guides

### For First-Time Users
→ Read **[POSTMAN_QUICK_START.md](./POSTMAN_QUICK_START.md)**
- 5-minute overview
- Essential workflows
- Quick reference

### For Detailed Testing
→ Read **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)**
- Complete endpoint reference
- Troubleshooting guide
- Advanced features

### For Test Scenarios
→ Read **[POSTMAN_TEST_SCENARIOS.md](./POSTMAN_TEST_SCENARIOS.md)**
- 30+ test scenarios
- Expected responses
- Edge cases & error handling

---

## 🧪 Running Tests

### In Postman Desktop

**Option 1: Single Request**
- Click any request → Send

**Option 2: Collection Runner**
1. Click **Runner** button
2. Select **Fuse16tt API Collection**
3. Select **Fuse16tt Local Environment**
4. Click **Run Fuse16tt API Collection**

### From Command Line

**Install Newman** (once):
```bash
npm install -g newman newman-reporter-htmlextra
```

**Run tests**:
```bash
./run-api-tests.sh
```

Or manually:
```bash
newman run Fuse16tt_API_Collection.postman_collection.json \
  -e Fuse16tt_Environment.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export report.html
```

**View HTML Report**:
```bash
open test-reports/report_*.html
```

---

## 🔍 Endpoints Quick Reference

### Authentication (No auth required)
```
POST   /auth/register     - Register new user
POST   /auth/login        - Login user
POST   /auth/refresh      - Refresh access token
POST   /auth/logout       - Logout user
```

### Users (Auth required)
```
GET    /users/me          - Get current user profile
GET    /users             - Get all users (Admin)
PATCH  /users/:id/role    - Update user role (Admin)
```

### User Statistics (Auth required)
```
GET    /api/v1/users/summary              - User summary
GET    /api/v1/users/signups-by-day       - Signups by day
GET    /api/v1/users/by-role              - Users by role
GET    /api/v1/users/active-per-hour      - Active per hour
GET    /api/v1/users/top-contributors     - Top contributors
```

### Articles (Auth required)
```
GET    /articles                - List articles (paginated)
POST   /articles                - Create article (Éditeur/Rédacteur)
GET    /articles/:id            - Get article by ID
PATCH  /articles/:id            - Update article (Author/Admin)
DELETE /articles/:id            - Delete article (Admin)
```

### Article Statistics (Auth required)
```
GET    /api/v1/articles/summary              - Article summary
GET    /api/v1/articles/count-by-day         - Articles by day
GET    /api/v1/articles/count-by-author      - Articles by author
GET    /api/v1/articles/top-by-comments      - Most commented
GET    /api/v1/articles/status-distribution  - By status
```

### Comments (Auth required)
```
POST   /articles/:id/comments   - Create comment
GET    /articles/:id/comments   - Get article comments
```

---

## 🎨 Collection Structure

```
Fuse16tt API Collection/
├── Authentication/
│   ├── Register User
│   ├── Login
│   ├── Refresh Token
│   └── Logout
│
├── Users/
│   ├── Get Current User
│   ├── Get All Users (Admin)
│   └── Update User Role (Admin)
│
├── Users - Dashboard Stats/
│   ├── Get User Summary
│   ├── Get Signups by Day
│   ├── Get Users by Role
│   ├── Get Active Users per Hour
│   └── Get Top Contributors
│
├── Articles/
│   ├── List Articles
│   ├── Create Article
│   ├── Get Article by ID
│   ├── Update Article
│   └── Delete Article (Admin)
│
├── Articles - Dashboard Stats/
│   ├── Get Article Summary
│   ├── Get Articles Count by Day
│   ├── Get Articles Count by Author
│   ├── Get Top Articles by Comments
│   └── Get Article Status Distribution
│
└── Comments/
    ├── Create Comment
    └── Get Article Comments
```

---

## 🔐 Authentication Flow

```
1. Register/Login
   ↓
   [Saves accessToken + refreshToken to environment]
   ↓
2. Make authenticated request
   ↓
   [Pre-request script checks token expiry]
   ↓
3a. Token valid?          3b. Token expiring?
    → Use it                  → Auto-refresh
                              → Use new token
   ↓                          ↓
4. Request executes with Bearer token
   ↓
5. Test script validates response
   ↓
6. Variables auto-updated (if needed)
```

---

## 🎯 User Roles & Permissions

| Role | Create Articles | Edit Own | Edit Others | Delete | Admin Panel |
|------|----------------|----------|-------------|--------|-------------|
| **Lecteur** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Rédacteur** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Éditeur** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

**Default role**: New users are created as `Lecteur`

---

## 🧪 Test Coverage

### ✅ Functional Tests
- User registration & validation
- Login with valid/invalid credentials
- Token refresh mechanism
- Article CRUD operations
- Comment functionality
- Dashboard statistics

### ✅ Authorization Tests
- Role-based access control
- Admin-only operations
- Author-only edit permissions

### ✅ Error Handling
- Invalid input validation
- Missing required fields
- Non-existent resource requests
- Expired token handling

### ✅ Edge Cases
- Duplicate email registration
- Empty payloads
- Invalid status values
- Pagination boundaries

---

## 🛠️ Customization

### Change Base URL

**For Production/Staging**:
1. Click environment (top-right)
2. Edit `baseUrl` variable
3. Change to your API URL

### Add Custom Headers

1. Click collection → **Edit**
2. Go to **Authorization** tab
3. Add custom headers if needed

### Modify Test Scripts

1. Click any request → **Tests** tab
2. Modify or add test assertions
3. Use Postman test snippets (right sidebar)

---

## 🐛 Troubleshooting

### Problem: Token not being saved

**Solution**:
1. Open **Postman Console** (View → Show Postman Console)
2. Check for JavaScript errors in test scripts
3. Verify response contains `accessToken` field

### Problem: 401 Unauthorized errors

**Solution**:
1. Check environment is selected (top-right)
2. Click eye icon 👁️ to verify `accessToken` exists
3. Try logging in again

### Problem: Services not responding

**Solution**:
```bash
# Check if services are running
curl http://localhost:3000  # API Gateway
curl http://localhost:4000  # User Service
curl http://localhost:7000  # Article Service
```

### Problem: Rate limit errors (429)

**Solution**:
- Wait for rate limit window to expire
- Use different test accounts
- Adjust rate limits in backend if needed

### Problem: CORS errors

**Solution**:
- Use Postman Desktop App (no CORS restrictions)
- Check backend CORS configuration
- Verify allowed origins in backend

---

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Start services
        run: |
          docker-compose up -d
          
      - name: Install Newman
        run: npm install -g newman
        
      - name: Run API tests
        run: |
          newman run Fuse16tt_API_Collection.postman_collection.json \
            -e Fuse16tt_Environment.postman_environment.json \
            --reporters cli,json \
            --reporter-json-export test-results.json
            
      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-results.json
```

---

## 📈 Performance Tips

### Speed Up Tests

1. **Remove delays**: Delete any `pm.test` with `setTimeout`
2. **Run in parallel**: Use Newman with `-n` flag
3. **Skip rate-limited endpoints**: Comment out in collection

### Optimize Collection

1. **Use folders**: Organize related requests
2. **Share variables**: Use environment variables
3. **Reuse responses**: Save as examples

---

## 🎓 Learning Resources

### Postman Docs
- [Postman Learning Center](https://learning.postman.com/)
- [Writing Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Using Variables](https://learning.postman.com/docs/sending-requests/variables/)

### Newman (CLI)
- [Newman Documentation](https://github.com/postmanlabs/newman)
- [Newman Reporters](https://learning.postman.com/docs/running-collections/using-newman-cli/newman-reporters/)

---

## 📝 Changelog

### Version 1.0 (Current)
- ✅ Complete API coverage (24+ endpoints)
- ✅ Automatic token management
- ✅ Auto-refresh tokens
- ✅ Test scripts for all requests
- ✅ Environment variable management
- ✅ CLI test runner (Newman)
- ✅ Comprehensive documentation

### Planned Features
- [ ] Mock servers for offline testing
- [ ] Additional test assertions
- [ ] Performance benchmarking
- [ ] Integration test workflows

---

## 🤝 Contributing

To add new endpoints:

1. **Add request to collection**
   - Choose appropriate folder
   - Add auth (inherits from collection)
   - Add test script

2. **Update documentation**
   - Add to POSTMAN_GUIDE.md
   - Add test scenario to POSTMAN_TEST_SCENARIOS.md

3. **Test thoroughly**
   - Run in Postman
   - Run with Newman
   - Verify auto-save works

---

## 📞 Support

### Issues?
1. Check [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) troubleshooting section
2. View Postman Console for detailed logs
3. Check backend service logs

### Questions?
- Review [POSTMAN_TEST_SCENARIOS.md](./POSTMAN_TEST_SCENARIOS.md) for examples
- Check [API_EXAMPLES.md](./API_EXAMPLES.md) for API docs

---

## ✅ Quick Checklist

Before starting:
- [ ] Imported both JSON files
- [ ] Selected environment
- [ ] Started all services (ports 3000, 4000, 7000)
- [ ] Verified gateway responds: `curl http://localhost:3000`

First test:
- [ ] Registered a user
- [ ] Token auto-saved
- [ ] Made authenticated request
- [ ] Request succeeded

Advanced:
- [ ] Tested token refresh
- [ ] Tested role-based access
- [ ] Ran collection runner
- [ ] Generated CLI report

---

## 🎉 You're All Set!

This collection provides everything you need to:
- ✅ Test all API endpoints
- ✅ Validate authentication flow
- ✅ Test role-based permissions
- ✅ Generate test reports
- ✅ Integrate with CI/CD

**Start with**: [POSTMAN_QUICK_START.md](./POSTMAN_QUICK_START.md)

**Happy Testing! 🚀**

---

## 📄 Files Summary

| File | Size | Purpose |
|------|------|---------|
| `Fuse16tt_API_Collection.postman_collection.json` | ~35KB | Main collection |
| `Fuse16tt_Environment.postman_environment.json` | ~1KB | Environment vars |
| `run-api-tests.sh` | ~3KB | CLI test runner |
| `POSTMAN_QUICK_START.md` | ~8KB | Quick start guide |
| `POSTMAN_GUIDE.md` | ~25KB | Complete manual |
| `POSTMAN_TEST_SCENARIOS.md` | ~30KB | Test scenarios |
| `POSTMAN_COLLECTION_README.md` | ~15KB | This file |

**Total**: 7 files, ready to use! 🎁
