# Install Auth Fix - Quick Setup

## Step 1: Install Dependencies

Run this command to install the required cookie-parser package:

```bash
cd backend/ApiGateway && npm install && cd ../..
```

Or if using yarn:

```bash
cd backend/ApiGateway && yarn install && cd ../..
```

## Step 2: Verify Environment Variables

Make sure your `.env` files have these settings:

### backend/UserService/.env
```env
JWT_ACCESS_SECRET=your-secret-key-here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES_SECONDS=604800
REFRESH_TOKEN_COOKIE_NAME=refreshToken
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=localhost
USER_SERVICE_PORT=4000
FRONTEND_ORIGIN=http://localhost:4200
```

### backend/ApiGateway/.env
```env
API_GATEWAY_PORT=8000
FRONTEND_ORIGIN=http://localhost:4200
```

## Step 3: Restart Services

Stop all running services (Ctrl+C in each terminal), then restart:

```bash
# Terminal 1: API Gateway
cd backend/ApiGateway
npm run start

# Terminal 2: UserService  
cd backend/UserService
npm run start

# Terminal 3: Frontend
cd frontend
npm start
```

## Step 4: Test

1. Open browser to http://localhost:4200
2. Open DevTools (F12) → Network tab
3. Log in with your credentials
4. Check:
   - ✅ `refreshToken` cookie is set (Application → Cookies)
   - ✅ `accessToken` in localStorage
   - ✅ API requests have `Authorization` header
   - ✅ After 15 minutes, token auto-refreshes on next request

## What Was Fixed?

1. ✅ **Cookie Forwarding**: API Gateway now properly forwards cookies between frontend and backend
2. ✅ **Token Expiry**: Access tokens now last 15 minutes instead of 2 minutes
3. ✅ **User Data**: Refresh endpoint now returns user data to keep frontend in sync
4. ✅ **RxJS Compatibility**: Fixed deprecated throwError syntax

See `AUTH_FIX_SUMMARY.md` for complete details.
