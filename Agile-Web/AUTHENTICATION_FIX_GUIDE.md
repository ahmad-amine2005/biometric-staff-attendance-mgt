# Authentication Setup Guide for Attendance System

## Problem Fixed ✅

The **403 Forbidden** error occurred because your backend requires JWT authentication for all API endpoints except `/auth/**`. 

### What I Fixed:

1. **Created Auth Service** (`services/auth.ts`)
   - Manages JWT token storage in localStorage
   - Provides login/logout functionality
   - Tracks authentication state

2. **Created HTTP Interceptor** (`interceptors/auth.interceptor.ts`)
   - Automatically adds `Authorization: Bearer <token>` header to all HTTP requests
   - Skips auth endpoints to avoid circular issues

3. **Registered Interceptor** in `app.config.ts`
   - Now all HTTP requests will include the JWT token automatically

4. **Updated Attendance Component**
   - Better error messages for 401/403 errors
   - User-friendly message: "Authentication required. Please log in..."

---

## How to Use It Now

### Option 1: Login Through Your App (Recommended)

1. **Start Backend:**
   ```bash
   cd Back-end/Fingerprint-management
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd Agile-Web
   ng serve
   ```

3. **Login:**
   - Navigate to your login page
   - Enter admin credentials
   - The Auth service will automatically save the JWT token
   - Navigate to Attendance Records page
   - Data will load successfully! ✅

### Option 2: Manually Set Token in Browser Console (For Testing)

If you want to test without implementing the full login flow:

1. **Get a JWT token from backend:**
   ```bash
   curl -X POST http://localhost:8080/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"yourPassword"}'
   ```

2. **Open browser console (F12)** and run:
   ```javascript
   localStorage.setItem('auth_token', 'YOUR_JWT_TOKEN_HERE');
   ```

3. **Refresh the Attendance Records page** - it should work now!

---

## Implementation Details

### How the Interceptor Works

```
1. Component calls: attendanceService.getAllAttendance()
   ↓
2. HttpClient prepares: GET http://localhost:8080/api/attendance
   ↓
3. Auth Interceptor intercepts the request
   ↓
4. Interceptor gets token from: authService.getToken()
   ↓
5. Interceptor adds header: Authorization: Bearer eyJhbGc...
   ↓
6. Request sent to backend with token
   ↓
7. Backend JWT Filter validates token ✅
   ↓
8. Backend returns data
   ↓
9. Component receives and displays data
```

### Token Storage

The JWT token is stored in `localStorage`:
- **Key:** `auth_token`
- **Value:** The JWT token string from login response

You can check it in browser DevTools:
- F12 → Application tab → Local Storage → http://localhost:4200

---

## Testing the Fix

### Test 1: Without Token (Should Show Error)

1. Clear localStorage: `localStorage.clear()`
2. Refresh Attendance Records page
3. **Expected:** "Authentication required. Please log in to view attendance records."

### Test 2: With Token (Should Load Data)

1. Login through your app OR set token manually
2. Navigate to Attendance Records page
3. **Expected:** Table displays attendance data

### Test 3: Network Tab Verification

1. Open DevTools (F12) → Network tab
2. Reload Attendance Records page
3. Click on the `attendance` request
4. Check Headers section
5. **Expected to see:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Login Implementation Example

If you need to implement the login page, here's how to use the Auth service:

### In your Login Component:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

export class LoginComponent {
  private authService = inject(Auth);
  private router = inject(Router);
  
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Redirect to dashboard or attendance page
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Login failed: ' + error.message;
        this.isLoading = false;
      }
    });
  }
}
```

### In your Login Template:

```html
<form (submit)="login()">
  <input 
    [(ngModel)]="email" 
    type="email" 
    placeholder="Email" 
    required>
  
  <input 
    [(ngModel)]="password" 
    type="password" 
    placeholder="Password" 
    required>
  
  <button type="submit" [disabled]="isLoading">
    {{ isLoading ? 'Logging in...' : 'Login' }}
  </button>
  
  <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
</form>
```

---

## Backend JWT Configuration

Your backend is already configured correctly:

✅ **Security Config** (`SecurityConfig.java`)
- `/auth/**` endpoints are public (no token needed)
- All other endpoints require authentication
- CORS enabled for `http://localhost:4200`

✅ **JWT Filter** (`JwtFilter.java`)
- Validates Bearer tokens
- Extracts token from `Authorization` header
- Looks for format: `Bearer <token>`

---

## Troubleshooting

### Issue: Still Getting 403 After Login

**Check:**
1. Token is saved in localStorage:
   ```javascript
   console.log(localStorage.getItem('auth_token'));
   ```

2. Token is being sent in requests (Network tab → Headers):
   ```
   Authorization: Bearer <token>
   ```

3. Token is valid (not expired)

### Issue: "No valid Bearer token found"

**Causes:**
- Token is not in localStorage
- Token format is wrong (should be just the token string, not "Bearer token")
- Token has expired

**Fix:**
- Login again to get a fresh token
- Check localStorage: `localStorage.getItem('auth_token')`

### Issue: Token Expired

JWT tokens have an expiration time. If your token expired:
1. The backend will return 401 Unauthorized
2. The frontend will show: "Your session has expired. Please log in again."
3. User needs to login again

---

## Quick Test Command

Test if your backend authentication is working:

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourPassword"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Use token to get attendance
curl -X GET http://localhost:8080/api/attendance \
  -H "Authorization: Bearer $TOKEN"
```

If this works, your backend is fine and the issue was just the missing token in frontend requests.

---

## Summary

### Before Fix:
```
Frontend → GET /api/attendance (no Authorization header)
Backend → 403 Forbidden ❌
```

### After Fix:
```
Frontend → GET /api/attendance
          + Authorization: Bearer <token>
Backend → Validates token → 200 OK ✅
Frontend → Displays data
```

### Files Modified:
1. ✅ `services/auth.ts` - JWT token management
2. ✅ `interceptors/auth.interceptor.ts` - Auto-add token to requests
3. ✅ `app.config.ts` - Register interceptor
4. ✅ `pages/attendance-records/attendance-records.ts` - Better error handling
5. ✅ `pages/attendance-records/attendance-records.html` - Fixed HTML structure

### What You Need To Do:
1. **Either:** Implement login page using the Auth service
2. **Or:** Set a test token in localStorage for development
3. Refresh the Attendance Records page
4. It should work now! 🎉

---

## Need Help?

If you still see authentication errors:
1. Check browser console for errors
2. Check Network tab for request headers
3. Verify token is in localStorage
4. Try the curl test command above
5. Check backend logs for JWT validation errors

