# Authentication & Refresh Token Fix Summary

## Issues Fixed

### 1. **API Gateway Cookie Forwarding** ✅
**Problem**: The API Gateway wasn't properly forwarding cookies between the frontend and backend services, causing refresh tokens stored in HttpOnly cookies to not reach the UserService.

**Solution**: 
- Added `cookie-parser` middleware to API Gateway
- Configured `express-http-proxy` with proper options to preserve cookies:
  - `proxyReqOptDecorator`: Forwards cookies from client to backend services
  - `userResDecorator`: Forwards Set-Cookie headers from backend to client (for auth routes)
  - `preserveHostHdr`: Preserves the original host header
  - `parseReqBody: false`: Prevents body parsing issues with the proxy

### 2. **Access Token Expiry Time** ✅
**Problem**: Access token was expiring after only 2 minutes, causing excessive refresh token requests and poor user experience.

**Solution**: Changed access token expiry from `2m` to `15m` (configurable via `JWT_ACCESS_EXPIRES` environment variable).

### 3. **Missing User Data in Refresh Response** ✅
**Problem**: When refreshing tokens, the backend wasn't returning user information, which could cause the frontend to lose user context.

**Solution**: 
- Backend now returns user data (id, name, email, role) in refresh token response
- Frontend AuthService now updates UserService with user data from refresh response

### 4. **Deprecated RxJS Error Handling** ✅
**Problem**: Frontend was using deprecated `throwError()` syntax without factory functions.

**Solution**: Updated to use `throwError(() => error)` syntax for RxJS 7+ compatibility.

### 5. **Concurrent Refresh Token Requests** ✅
**Problem**: When multiple API calls failed simultaneously (e.g., on initial page load), the interceptor would trigger multiple refresh token requests concurrently, which could cause race conditions.

**Solution**: 
- Implemented a shared observable pattern using `shareReplay(1)`
- Added `_refreshTokenInProgress` flag to track ongoing refresh operations
- Multiple concurrent requests now wait for the single refresh operation to complete
- Used `tap()` for side effects and `finalize()` to clean up the in-progress flag

## Files Modified

### Backend
1. **`backend/ApiGateway/src/server.ts`**
   - Added `cookie-parser` import and middleware

2. **`backend/ApiGateway/src/routes.ts`**
   - Enhanced proxy configuration for all routes (`/auth`, `/users`, `/articles`)
   - Added cookie forwarding logic
   - Added Set-Cookie header handling for auth responses

3. **`backend/ApiGateway/package.json`**
   - Added `cookie-parser` dependency
   - Added `@types/cookie-parser` dev dependency

4. **`backend/UserService/src/services/TokenService.ts`**
   - Changed access token expiry from `2m` to configurable `JWT_ACCESS_EXPIRES` (defaults to `15m`)

5. **`backend/UserService/src/controllers/AuthController.ts`**
   - Added user name to login response
   - Added full user object to refresh token response

### Frontend
1. **`frontend/src/app/core/auth/auth.service.ts`**
   - Updated `refreshToken()` to handle and store user data from response
   - Fixed deprecated `throwError()` syntax in multiple methods

2. **`frontend/src/app/core/auth/auth.interceptor.ts`**
   - Fixed deprecated `throwError()` syntax

## Environment Configuration

### Required Environment Variables

#### UserService (.env)
```env
# JWT Configuration
JWT_ACCESS_SECRET=your-secret-key-here
JWT_ACCESS_EXPIRES=15m                    # NEW: Configurable access token expiry
JWT_REFRESH_EXPIRES_SECONDS=604800        # 7 days in seconds

# Cookie Configuration
REFRESH_TOKEN_COOKIE_NAME=refreshToken
COOKIE_SECURE=false                        # Set to true in production
COOKIE_SAME_SITE=lax                       # Options: strict, lax, none
COOKIE_DOMAIN=localhost                    # Change to your domain in production

# Service Configuration
USER_SERVICE_PORT=4000
MONGO_URI=mongodb://localhost:27017/your_db
FRONTEND_ORIGIN=http://localhost:4200
```

#### API Gateway (.env)
```env
# Service Ports
API_GATEWAY_PORT=8000
USER_SERVICE_URL=http://localhost:4000
ARTICLE_SERVICE_URL=http://localhost:7000

# CORS Configuration
FRONTEND_ORIGIN=http://localhost:4200      # Must match UserService
```

## How It Works Now

### 1. **Login Flow**
```
Frontend (http://localhost:4200)
   ↓ POST /auth/login with credentials
API Gateway (http://localhost:8000)
   ↓ Forwards to UserService with cookies enabled
UserService (http://localhost:4000)
   ↓ Validates credentials
   ↓ Creates access token (JWT, 15min expiry)
   ↓ Creates refresh token (opaque, stored in Redis, 7 days)
   ↓ Sets HttpOnly cookie with refresh token
   ↓ Returns: { accessToken, user: { id, name, email, role } }
API Gateway
   ↓ Forwards Set-Cookie header to frontend
Frontend
   ✓ Stores accessToken in localStorage
   ✓ Stores userId in localStorage
   ✓ Receives refreshToken in HttpOnly cookie
   ✓ Updates UserService with user data
```

### 2. **API Request Flow with Valid Token**
```
Frontend
   ↓ GET /users/me with Authorization: Bearer <accessToken>
Interceptor
   ✓ Token not expired, adds Authorization header
API Gateway
   ↓ Forwards with Authorization header
UserService
   ✓ Validates token via authenticate middleware
   ✓ Returns user data
```

### 3. **Token Refresh Flow**
```
Frontend
   ↓ GET /users/me with expired/missing accessToken
API Gateway → UserService
   ↓ Returns 401 Unauthorized
Interceptor
   ✓ Catches 401 error
   ✓ Checks if not auth endpoint
   ↓ POST /auth/refresh with { userId } + refreshToken cookie
API Gateway
   ✓ Forwards cookies to UserService
UserService
   ✓ Reads refresh token from cookie
   ✓ Validates against Redis
   ✓ Rotates refresh token (revokes old, creates new)
   ✓ Creates new access token
   ✓ Sets new HttpOnly cookie
   ✓ Returns: { accessToken, user: { id, name, email, role } }
Frontend
   ✓ Stores new accessToken
   ✓ Updates user data in UserService
   ✓ Retries original request with new token
```

### 4. **Logout Flow**
```
Frontend
   ↓ POST /auth/logout with { userId } + refreshToken cookie
API Gateway → UserService
   ✓ Revokes refresh token from Redis
   ✓ Clears refreshToken cookie
Frontend
   ✓ Removes accessToken from localStorage
   ✓ Removes userId from localStorage
   ✓ Clears authenticated state
```

## Security Features

1. **HttpOnly Cookies**: Refresh tokens are stored in HttpOnly cookies, preventing XSS attacks
2. **Secure Flag**: In production, cookies use the Secure flag for HTTPS-only transmission
3. **SameSite**: Configured with SameSite=lax to prevent CSRF attacks
4. **Token Rotation**: Refresh tokens are rotated on each use (old token revoked, new token issued)
5. **Short-lived Access Tokens**: Access tokens expire after 15 minutes
6. **Opaque Refresh Tokens**: Refresh tokens are random 128-character strings (not JWTs)
7. **Hashed Storage**: Refresh tokens are stored hashed in Redis using bcrypt

## Testing the Fix

### 1. Install Dependencies
```bash
cd backend/ApiGateway
npm install
# or
yarn install
```

### 2. Start Services
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

### 3. Test Authentication
1. **Login**: Try logging in with valid credentials
   - Check browser DevTools → Application → Cookies
   - You should see `refreshToken` cookie (HttpOnly)
   - Check localStorage for `accessToken` and `userId`

2. **API Requests**: Navigate through the app
   - Check Network tab to see `Authorization: Bearer <token>` headers
   - Requests should succeed with 200 status

3. **Token Refresh**: Wait 15 minutes or manually expire the token
   - Make an API request
   - Should see 401 → refresh call → retry with new token
   - Check that app continues working seamlessly

4. **Logout**: Click logout
   - Cookie should be cleared
   - localStorage should be cleared
   - You should be redirected to login

### 4. Verify Cookie Forwarding
Open browser DevTools Network tab:

**Login Request**:
```
Request: POST http://localhost:8000/auth/login
Response Headers: Set-Cookie: refreshToken=...; HttpOnly; SameSite=lax
```

**Refresh Request**:
```
Request: POST http://localhost:8000/auth/refresh
Request Headers: Cookie: refreshToken=...
Response Headers: Set-Cookie: refreshToken=...; HttpOnly; SameSite=lax
```

## Troubleshooting

### Cookies Not Being Set
- Verify `COOKIE_DOMAIN` matches your setup (use `localhost` for local development)
- Check `COOKIE_SECURE` is `false` for HTTP (local) or `true` for HTTPS (production)
- Ensure frontend URL matches `FRONTEND_ORIGIN` in backend .env

### Cookies Not Forwarding Through API Gateway
- Verify `cookie-parser` is installed: `npm list cookie-parser`
- Check API Gateway logs for cookie presence
- Ensure `withCredentials: true` is set on frontend HTTP requests

### Refresh Token Invalid
- Check Redis is running and accessible
- Verify refresh token exists in Redis: `redis-cli KEYS refresh:*`
- Check token rotation is not causing issues with concurrent requests

### 401 Errors After Login
- Verify access token is being stored in localStorage
- Check token format in `Authorization` header (should be `Bearer <token>`)
- Verify `JWT_ACCESS_SECRET` matches between token creation and validation

## Production Checklist

- [ ] Set `JWT_ACCESS_SECRET` to a strong random value
- [ ] Set `COOKIE_SECURE=true`
- [ ] Update `COOKIE_DOMAIN` to your production domain
- [ ] Consider setting `COOKIE_SAME_SITE=strict` for stricter security
- [ ] Configure proper CORS origins (don't use wildcard)
- [ ] Use HTTPS for all services
- [ ] Set up Redis persistence for refresh tokens
- [ ] Consider implementing rate limiting on auth endpoints
- [ ] Set up monitoring for failed auth attempts
- [ ] Consider reducing `JWT_ACCESS_EXPIRES` further if needed

## Additional Improvements (Optional)

1. **Automatic Silent Refresh**: Implement a timer in the frontend to refresh tokens before they expire
2. **Fingerprinting**: Add device fingerprinting to refresh tokens for additional security
3. **Multi-Device Support**: Store multiple refresh tokens per user with device info
4. **Blacklisting**: Implement access token blacklisting for immediate revocation
5. **2FA**: Add two-factor authentication support
6. **Session Management**: Add endpoint to view/revoke active sessions
