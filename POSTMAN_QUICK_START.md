# 🚀 Postman Collection - Quick Start

## What You Get

✅ **Complete API collection** with all endpoints  
✅ **Automatic token management** - login once, test everything  
✅ **Auto-refresh tokens** - never worry about expired tokens  
✅ **Pre-configured environment** - ready to use  
✅ **Test scripts** - automatic validation  
✅ **CLI test runner** - for automation  

---

## 📥 Import to Postman (30 seconds)

### Option 1: Drag & Drop
1. Open Postman Desktop
2. Click **Import** button (top-left)
3. Drag these files:
   - `Fuse16tt_API_Collection.postman_collection.json`
   - `Fuse16tt_Environment.postman_environment.json`
4. Click **Import**
5. Select **"Fuse16tt Local Environment"** (top-right dropdown)

### Option 2: File Upload
1. Click **Import** → **Upload Files**
2. Select both JSON files
3. Click **Open** → **Import**

---

## ✅ Prerequisites

Make sure your services are running:

```bash
# Terminal 1 - API Gateway
cd backend/ApiGateway && npm run dev

# Terminal 2 - User Service  
cd backend/UserService && npm run dev

# Terminal 3 - Article Service
cd backend/ArticleService && npm run dev

# Terminal 4 - Notification Service (optional)
cd backend/NotificationService && npm run dev
```

**Verify**: Visit http://localhost:3000 - should see "API Gateway is running"

---

## 🎯 First Test (1 minute)

### 1. Register a User
- Open collection: **Authentication** → **Register User**
- Click **Send**
- ✅ Access token automatically saved!

### 2. Get Your Profile
- Open: **Users** → **Get Current User**
- Click **Send**
- ✅ Token automatically attached!

### 3. Create an Article
- Open: **Articles** → **Create Article**
- Click **Send**
- ✅ Article ID automatically saved!

**That's it!** The token is now attached to all requests automatically. 🎉

---

## 🔐 Authentication Magic

### What Happens Automatically

1. **Login/Register** → Saves `accessToken` + `refreshToken`
2. **Every Request** → Attaches Bearer token automatically
3. **Token Expiring?** → Auto-refreshes before expiry
4. **Logout** → Clears all tokens

### No Manual Work Needed!

❌ **Before**: Copy token → Paste in header → Repeat every 15 minutes  
✅ **After**: Login once → Test for hours!

---

## 📚 Full Endpoint List

### 🔑 Authentication (No auth required)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### 👤 Users (Requires auth)
- `GET /users/me` - Get current user
- `GET /users` - Get all users (Admin only)
- `PATCH /users/:id/role` - Update user role (Admin only)

### 📊 User Statistics
- `GET /api/v1/users/summary` - User summary
- `GET /api/v1/users/signups-by-day` - Signups by day
- `GET /api/v1/users/by-role` - Users by role
- `GET /api/v1/users/active-per-hour` - Active users
- `GET /api/v1/users/top-contributors` - Top contributors

### 📝 Articles (Requires auth)
- `GET /articles` - List articles (paginated)
- `POST /articles` - Create article (Éditeur/Rédacteur)
- `GET /articles/:id` - Get article by ID
- `PATCH /articles/:id` - Update article (Author/Admin)
- `DELETE /articles/:id` - Delete article (Admin only)

### 📊 Article Statistics
- `GET /api/v1/articles/summary` - Article summary
- `GET /api/v1/articles/count-by-day` - Articles by day
- `GET /api/v1/articles/count-by-author` - Articles by author
- `GET /api/v1/articles/top-by-comments` - Most commented
- `GET /api/v1/articles/status-distribution` - By status

### 💬 Comments (Requires auth)
- `POST /articles/:id/comments` - Create comment
- `GET /articles/:id/comments` - Get article comments

---

## 🧪 Run Tests from CLI

### Install Newman (Postman CLI)

```bash
npm install -g newman newman-reporter-htmlextra
```

### Run All Tests

```bash
./run-api-tests.sh
```

Or manually:

```bash
newman run Fuse16tt_API_Collection.postman_collection.json \
  -e Fuse16tt_Environment.postman_environment.json
```

Generates HTML report in `test-reports/` folder.

---

## 🐛 Troubleshooting

### "401 Unauthorized"
**Solution**: Login again via **Authentication** → **Login**

### "Cannot connect to localhost:3000"
**Solution**: Start API Gateway: `cd backend/ApiGateway && npm run dev`

### "Token not being saved"
**Solution**: 
1. Check environment is selected (top-right)
2. Open Console: **View** → **Show Postman Console**
3. Look for errors

### "CORS Error"
**Solution**: Use Postman Desktop App (not web version)

---

## 💡 Pro Tips

### 1. View Environment Variables
Click the **eye icon** 👁️ (top-right) to see all saved values

### 2. Use Collection Runner
- Click **Runner** button
- Select collection
- Run all requests in sequence

### 3. Test Token Refresh
1. Get `accessToken` from environment (👁️ icon)
2. Wait 15 minutes OR manually clear it
3. Make any request → auto-refreshes!

### 4. Test Different Roles
1. Register multiple users
2. Change roles in database:
   - `Lecteur` - Read only
   - `Rédacteur` - Can create articles
   - `Éditeur` - Can create & edit
   - `Admin` - Full access
3. Login as each user to test permissions

### 5. Copy as cURL
Right-click any request → **Code** → **cURL** to get CLI command

---

## 📖 Need More Details?

- **Full Guide**: See [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)
- **API Examples**: See [API_EXAMPLES.md](./API_EXAMPLES.md)
- **Project README**: See [readme.md](./readme.md)

---

## 🎉 You're Ready!

Open Postman, select the environment, and start testing!

**Questions?** Check the [full guide](./POSTMAN_GUIDE.md) or Postman Console for detailed logs.

---

**Happy Testing! 🚀**
