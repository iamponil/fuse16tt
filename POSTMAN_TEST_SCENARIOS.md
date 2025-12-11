# 🧪 Postman Test Scenarios

This guide provides comprehensive test scenarios to validate all aspects of your API.

---

## 🔐 Authentication Test Scenarios

### Scenario 1: Successful User Registration

**Request**: `POST /auth/register`

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response** (201):
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "Lecteur"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Validates**:
- ✅ User created with default role "Lecteur"
- ✅ Tokens generated
- ✅ Password is hashed (not returned)

---

### Scenario 2: Registration Validation Errors

**Test A: Short Password**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "short"
}
```
**Expected**: 400 Bad Request - "password must be at least 8 chars"

**Test B: Invalid Email**
```json
{
  "name": "Test User",
  "email": "not-an-email",
  "password": "SecurePass123"
}
```
**Expected**: 400 Bad Request - Invalid email format

**Test C: Short Name**
```json
{
  "name": "A",
  "email": "test@example.com",
  "password": "SecurePass123"
}
```
**Expected**: 400 Bad Request - Name must be at least 2 characters

**Test D: Duplicate Email**
1. Register user with email `duplicate@example.com`
2. Try to register again with same email
**Expected**: 409 Conflict - Email already exists

---

### Scenario 3: Login Flow

**Request**: `POST /auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response** (200):
```json
{
  "user": { /* user details */ },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Test Invalid Credentials**:
```json
{
  "email": "john.doe@example.com",
  "password": "WrongPassword"
}
```
**Expected**: 401 Unauthorized

---

### Scenario 4: Token Refresh

**Request**: `POST /auth/refresh`

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Expected Response** (200):
```json
{
  "accessToken": "new_token_here"
}
```

**Test Invalid Refresh Token**:
```json
{
  "refreshToken": "invalid_token"
}
```
**Expected**: 401 Unauthorized

---

### Scenario 5: Logout

**Request**: `POST /auth/logout`

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Expected Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

**After Logout**:
- Try to use the old refresh token → Should fail (401)
- Access token should still work until expiry

---

## 👤 User Management Test Scenarios

### Scenario 6: Get Current User

**Request**: `GET /users/me`  
**Headers**: `Authorization: Bearer {{accessToken}}`

**Expected Response** (200):
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Lecteur",
  "createdAt": "2024-12-11T00:00:00Z"
}
```

**Test Without Token**:
**Expected**: 401 Unauthorized

---

### Scenario 7: Get All Users (Admin Only)

**Setup**: 
1. Create admin user (or update role in DB)
2. Login as admin

**Request**: `GET /users`  
**Headers**: `Authorization: Bearer {{adminAccessToken}}`

**Expected Response** (200):
```json
[
  {
    "id": "uuid1",
    "name": "User 1",
    "email": "user1@example.com",
    "role": "Lecteur"
  },
  {
    "id": "uuid2",
    "name": "User 2",
    "email": "user2@example.com",
    "role": "Éditeur"
  }
]
```

**Test As Non-Admin**:
**Expected**: 403 Forbidden

---

### Scenario 8: Update User Role (Admin Only)

**Request**: `PATCH /users/:userId/role`  
**Headers**: `Authorization: Bearer {{adminAccessToken}}`

```json
{
  "role": "Éditeur"
}
```

**Expected Response** (200):
```json
{
  "message": "Role updated successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "Éditeur"
  }
}
```

**Test Invalid Role**:
```json
{
  "role": "InvalidRole"
}
```
**Expected**: 400 Bad Request

**Test As Non-Admin**:
**Expected**: 403 Forbidden

---

## 📝 Article Management Test Scenarios

### Scenario 9: Create Article (Éditeur/Rédacteur)

**Setup**: Login as user with Éditeur or Rédacteur role

**Request**: `POST /articles`

```json
{
  "title": "My First Article",
  "content": "This is the content of my article. It should be informative and well-written.",
  "status": "draft"
}
```

**Expected Response** (201):
```json
{
  "id": "article-uuid",
  "title": "My First Article",
  "content": "This is the content...",
  "status": "draft",
  "authorId": "user-uuid",
  "createdAt": "2024-12-11T00:00:00Z"
}
```

**Test As Lecteur** (Reader role):
**Expected**: 403 Forbidden

**Test Empty Title**:
```json
{
  "content": "Content without title",
  "status": "draft"
}
```
**Expected**: 400 Bad Request

---

### Scenario 10: List Articles with Pagination

**Request**: `GET /articles?page=1&limit=10`

**Expected Response** (200):
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Article 1",
      "content": "Content...",
      "status": "published",
      "authorId": "author-uuid",
      "author": {
        "name": "Author Name"
      },
      "commentsCount": 5
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalArticles": 25,
    "limit": 10
  }
}
```

**Test Filter by Status**:
`GET /articles?status=published&page=1&limit=10`

**Test Different Page**:
`GET /articles?page=2&limit=5`

---

### Scenario 11: Get Article by ID

**Request**: `GET /articles/:articleId`

**Expected Response** (200):
```json
{
  "id": "article-uuid",
  "title": "Article Title",
  "content": "Full article content...",
  "status": "published",
  "authorId": "author-uuid",
  "author": {
    "id": "author-uuid",
    "name": "Author Name",
    "email": "author@example.com"
  },
  "comments": [
    {
      "id": "comment-uuid",
      "content": "Great article!",
      "userId": "commenter-uuid",
      "createdAt": "2024-12-11T00:00:00Z"
    }
  ],
  "createdAt": "2024-12-10T00:00:00Z",
  "updatedAt": "2024-12-11T00:00:00Z"
}
```

**Test Non-existent Article**:
`GET /articles/invalid-uuid`
**Expected**: 404 Not Found

---

### Scenario 12: Update Article (Author or Admin)

**Setup**: Login as article author or admin

**Request**: `PATCH /articles/:articleId`

```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published"
}
```

**Expected Response** (200):
```json
{
  "id": "article-uuid",
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published",
  "updatedAt": "2024-12-11T01:00:00Z"
}
```

**Test As Different User (Not Author/Admin)**:
**Expected**: 403 Forbidden

**Test Invalid Status**:
```json
{
  "status": "invalid_status"
}
```
**Expected**: 400 Bad Request

---

### Scenario 13: Delete Article (Admin Only)

**Setup**: Login as admin

**Request**: `DELETE /articles/:articleId`

**Expected Response** (200 or 204):
```json
{
  "message": "Article deleted successfully"
}
```

**Verify Deletion**:
Try to GET the deleted article → Should return 404

**Test As Non-Admin**:
**Expected**: 403 Forbidden

---

## 💬 Comment Test Scenarios

### Scenario 14: Add Comment to Article

**Request**: `POST /articles/:articleId/comments`

```json
{
  "content": "This is a great article! Thanks for sharing."
}
```

**Expected Response** (201):
```json
{
  "id": "comment-uuid",
  "content": "This is a great article! Thanks for sharing.",
  "articleId": "article-uuid",
  "userId": "user-uuid",
  "user": {
    "name": "Commenter Name"
  },
  "createdAt": "2024-12-11T00:00:00Z"
}
```

**Test Empty Comment**:
```json
{
  "content": ""
}
```
**Expected**: 400 Bad Request

**Test Non-existent Article**:
`POST /articles/invalid-uuid/comments`
**Expected**: 404 Not Found

---

### Scenario 15: Get Article Comments

**Request**: `GET /articles/:articleId/comments`

**Expected Response** (200):
```json
[
  {
    "id": "comment-uuid-1",
    "content": "First comment",
    "userId": "user-uuid-1",
    "user": {
      "name": "User One",
      "email": "user1@example.com"
    },
    "createdAt": "2024-12-11T00:00:00Z"
  },
  {
    "id": "comment-uuid-2",
    "content": "Second comment",
    "userId": "user-uuid-2",
    "user": {
      "name": "User Two",
      "email": "user2@example.com"
    },
    "createdAt": "2024-12-11T00:01:00Z"
  }
]
```

**Test Non-existent Article**:
**Expected**: 404 Not Found or Empty Array []

---

## 📊 Dashboard Statistics Scenarios

### Scenario 16: User Statistics

**Get User Summary**:
`GET /api/v1/users/summary`

**Expected Response** (200):
```json
{
  "totalUsers": 150,
  "activeUsers": 45,
  "newUsersToday": 3,
  "newUsersThisWeek": 12,
  "newUsersThisMonth": 42
}
```

**Get Signups by Day**:
`GET /api/v1/users/signups-by-day`

**Expected Response** (200):
```json
[
  { "date": "2024-12-11", "count": 3 },
  { "date": "2024-12-10", "count": 5 },
  { "date": "2024-12-09", "count": 4 }
]
```

**Get Users by Role**:
`GET /api/v1/users/by-role`

**Expected Response** (200):
```json
[
  { "role": "Admin", "count": 2 },
  { "role": "Éditeur", "count": 10 },
  { "role": "Rédacteur", "count": 25 },
  { "role": "Lecteur", "count": 113 }
]
```

---

### Scenario 17: Article Statistics

**Get Article Summary**:
`GET /api/v1/articles/summary`

**Expected Response** (200):
```json
{
  "totalArticles": 350,
  "publishedArticles": 280,
  "draftArticles": 50,
  "archivedArticles": 20,
  "articlesToday": 5,
  "articlesThisWeek": 23,
  "articlesThisMonth": 78
}
```

**Get Articles by Status**:
`GET /api/v1/articles/status-distribution`

**Expected Response** (200):
```json
[
  { "status": "published", "count": 280 },
  { "status": "draft", "count": 50 },
  { "status": "archived", "count": 20 }
]
```

**Get Top Articles by Comments**:
`GET /api/v1/articles/top-by-comments`

**Expected Response** (200):
```json
[
  {
    "id": "article-uuid-1",
    "title": "Most Popular Article",
    "commentsCount": 156,
    "author": "Author Name"
  },
  {
    "id": "article-uuid-2",
    "title": "Second Popular",
    "commentsCount": 98,
    "author": "Another Author"
  }
]
```

---

## 🚫 Rate Limiting Test Scenarios

### Scenario 18: Login Rate Limit

**Limit**: 5 requests per 15 minutes

**Test**:
1. Make 5 login attempts rapidly
2. Attempt 6th login

**Expected on 6th attempt** (429):
```json
{
  "error": "Too many requests, please try again later."
}
```

**Wait 15 minutes or use different IP to reset**

---

### Scenario 19: Register Rate Limit

**Limit**: 3 requests per hour

**Test**:
1. Register 3 users with different emails
2. Attempt 4th registration

**Expected on 4th attempt** (429):
```json
{
  "error": "Too many registration attempts"
}
```

---

### Scenario 20: Write Operations Rate Limit

**Limit**: 20 requests per 15 minutes (for POST/PATCH/DELETE)

**Test**:
1. Create 20 articles rapidly
2. Attempt 21st article

**Expected on 21st attempt** (429):
```json
{
  "error": "Rate limit exceeded"
}
```

---

## 🔒 Authorization Test Scenarios

### Scenario 21: Role-Based Access Control

**Test Matrix**:

| Endpoint | Lecteur | Rédacteur | Éditeur | Admin |
|----------|---------|-----------|---------|-------|
| GET /articles | ✅ | ✅ | ✅ | ✅ |
| POST /articles | ❌ 403 | ✅ | ✅ | ✅ |
| PATCH /articles (own) | ❌ 403 | ❌ 403 | ✅ | ✅ |
| PATCH /articles (other) | ❌ 403 | ❌ 403 | ❌ 403 | ✅ |
| DELETE /articles | ❌ 403 | ❌ 403 | ❌ 403 | ✅ |
| GET /users | ❌ 403 | ❌ 403 | ❌ 403 | ✅ |
| PATCH /users/:id/role | ❌ 403 | ❌ 403 | ❌ 403 | ✅ |

**Test Each Cell**:
1. Create user with specific role
2. Login as that user
3. Attempt the operation
4. Verify expected result

---

## 🐛 Error Handling Scenarios

### Scenario 22: Invalid JSON

**Request**: `POST /auth/register`  
**Body**: `{ invalid json }`

**Expected**: 400 Bad Request - "Invalid JSON"

---

### Scenario 23: Missing Required Fields

**Request**: `POST /articles`

```json
{
  "title": "Article without content"
}
```

**Expected**: 400 Bad Request - "Content is required"

---

### Scenario 24: SQL Injection Attempt

**Request**: `GET /articles?status=published'; DROP TABLE articles;--`

**Expected**: 
- Should NOT execute SQL
- Should return empty result or 400 Bad Request
- Verify table still exists

---

### Scenario 25: XSS Attempt

**Request**: `POST /articles`

```json
{
  "title": "<script>alert('XSS')</script>",
  "content": "Normal content",
  "status": "draft"
}
```

**Expected**:
- Content should be sanitized
- Script tags should be escaped or removed
- When retrieved, should not execute JavaScript

---

## 🔄 Workflow Test Scenarios

### Scenario 26: Complete Article Lifecycle

1. **Register** as Rédacteur
2. **Login** and save tokens
3. **Create** article (status: draft)
4. **List** articles (verify it appears)
5. **Get** article by ID (verify content)
6. **Add** comment to article
7. **Get** comments (verify comment appears)
8. **Update** article (status: published)
9. **Get** article again (verify status changed)
10. **Logout**

**Validate**: Each step succeeds with correct status codes

---

### Scenario 27: Multi-User Collaboration

1. **User A** (Rédacteur): Creates article
2. **User B** (Lecteur): Views article
3. **User B**: Adds comment
4. **User A**: Reads comment
5. **User C** (Éditeur): Edits article
6. **Admin**: Promotes User B to Rédacteur
7. **User B**: Now can create articles
8. **Admin**: Deletes article

---

### Scenario 28: Token Expiration Flow

1. **Login** and save access token
2. **Wait** 15 minutes (or manually expire)
3. **Make request** with expired token
4. **Expect**: 401 Unauthorized
5. **Use** refresh token
6. **Get** new access token
7. **Retry** original request
8. **Expect**: Success

---

## 📈 Performance Test Scenarios

### Scenario 29: Concurrent Requests

**Test**: Use Collection Runner or Newman
- Run 100 requests simultaneously
- Mix of different endpoints
- Verify: All return correct responses

---

### Scenario 30: Large Payload

**Request**: `POST /articles`

```json
{
  "title": "Very Long Article",
  "content": "Lorem ipsum... (10MB of text)",
  "status": "draft"
}
```

**Expected**: 
- If size limit exists: 413 Payload Too Large
- If no limit: Should handle gracefully

---

## 🎯 Test Execution Order

### Quick Smoke Test (5 requests)
1. Register
2. Login
3. Get Me
4. Create Article
5. List Articles

### Full Integration Test (20+ requests)
1. All Authentication scenarios
2. All User Management scenarios
3. All Article CRUD scenarios
4. All Comment scenarios
5. Dashboard statistics
6. Rate limiting (if time permits)

### Regression Test Suite (50+ requests)
- All scenarios above
- Edge cases
- Error handling
- Authorization matrix

---

## 📝 Manual Test Checklist

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Refresh token
- [ ] Get current user profile
- [ ] Get all users (as admin)
- [ ] Update user role (as admin)
- [ ] Create article (as Rédacteur)
- [ ] List articles with pagination
- [ ] Get article by ID
- [ ] Update own article
- [ ] Try to update other's article (should fail)
- [ ] Delete article (as admin)
- [ ] Add comment to article
- [ ] Get article comments
- [ ] Test all dashboard endpoints
- [ ] Test rate limiting on login
- [ ] Test token expiration
- [ ] Test role-based access control
- [ ] Logout

---

## 🤖 Automated Test Script

Create a test script for Newman:

```bash
# Run full test suite
newman run Fuse16tt_API_Collection.postman_collection.json \
  -e Fuse16tt_Environment.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export test-results.json

# Check results
if [ $? -eq 0 ]; then
  echo "All tests passed!"
else
  echo "Tests failed. Check test-results.json"
fi
```

---

**Happy Testing! 🚀**

For automation, use the `run-api-tests.sh` script included in the project.
