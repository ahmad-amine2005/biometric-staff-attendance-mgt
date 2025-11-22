# Admin Authentication - Quick Start Guide

## Prerequisites
- Server running on `http://localhost:8080`
- Content-Type: `application/json`

---

## 1. Register/Create a New Admin

### Endpoint
```
POST http://localhost:8080/api/admin/register
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "name": "John",
  "surname": "Admin",
  "email": "john.admin@company.com",
  "password": "admin123456"
}
```

### Success Response (201 Created)
```json
{
  "message": "Admin registered successfully",
  "adminId": 1,
  "email": "john.admin@company.com"
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "Email already registered"
}
```

---

## 2. Login/Authenticate Admin

### Endpoint
```
POST http://localhost:8080/api/admin/login
```

### Request Headers
```
Content-Type: application/json
```

### Request Body (Basic Login)
```json
{
  "email": "john.admin@company.com",
  "password": "admin123456"
}
```

### Request Body (Login with "Remember Me")
```json
{
  "email": "john.admin@company.com",
  "password": "admin123456",
  "rememberMe": true
}
```

### Success Response (200 OK)
```json
{
  "userId": 1,
  "email": "john.admin@company.com",
  "name": "John",
  "surname": "Admin",
  "fullName": "John Admin",
  "accessToken": "mock_token_1_1732233600000",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "issuedAt": "2025-11-22T10:30:00",
  "expiresAt": "2025-11-22T10:45:00",
  "role": "ROLE_ADMIN",
  "message": "Login successful"
}
```

### Error Responses

#### Invalid Credentials (401 Unauthorized)
```json
{
  "error": "Invalid email or password"
}
```

#### Inactive Account (401 Unauthorized)
```json
{
  "error": "Account is inactive. Please contact administrator."
}
```

---

## Complete Examples

### Using cURL

#### 1. Create Admin
```bash
curl -X POST http://localhost:8080/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "surname": "Admin",
    "email": "john.admin@company.com",
    "password": "admin123456"
  }'
```

#### 2. Login Admin
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.admin@company.com",
    "password": "admin123456"
  }'
```

#### 3. Login with Remember Me
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.admin@company.com",
    "password": "admin123456",
    "rememberMe": true
  }'
```

---

### Using Postman

#### 1. Create Admin
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/admin/register`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body:** (raw JSON)
```json
{
  "name": "John",
  "surname": "Admin",
  "email": "john.admin@company.com",
  "password": "admin123456"
}
```
5. Click **Send**

#### 2. Login Admin
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/admin/login`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body:** (raw JSON)
```json
{
  "email": "john.admin@company.com",
  "password": "admin123456"
}
```
5. Click **Send**

---

### Using JavaScript (Fetch API)

#### 1. Create Admin
```javascript
fetch('http://localhost:8080/api/admin/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John',
    surname: 'Admin',
    email: 'john.admin@company.com',
    password: 'admin123456'
  })
})
.then(response => response.json())
.then(data => console.log('Admin created:', data))
.catch(error => console.error('Error:', error));
```

#### 2. Login Admin
```javascript
fetch('http://localhost:8080/api/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john.admin@company.com',
    password: 'admin123456',
    rememberMe: false
  })
})
.then(response => response.json())
.then(data => {
  console.log('Login successful:', data);
  // Save the token for future requests
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('adminId', data.userId);
})
.catch(error => console.error('Error:', error));
```

---

### Using Python (Requests)

#### 1. Create Admin
```python
import requests

url = "http://localhost:8080/api/admin/register"
payload = {
    "name": "John",
    "surname": "Admin",
    "email": "john.admin@company.com",
    "password": "admin123456"
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

#### 2. Login Admin
```python
import requests

url = "http://localhost:8080/api/admin/login"
payload = {
    "email": "john.admin@company.com",
    "password": "admin123456",
    "rememberMe": False
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(f"Access Token: {data['accessToken']}")
print(f"User ID: {data['userId']}")
```

---

## Token Expiration Times

| Remember Me | Expiration Time |
|-------------|-----------------|
| `false` (default) | 15 minutes (900 seconds) |
| `true` | 7 days (604,800 seconds) |

---

## Field Validation Rules

### Registration
- ✅ **name**: Required, not blank
- ✅ **surname**: Required, not blank
- ✅ **email**: Required, must be valid email format, must be unique
- ✅ **password**: Required, minimum 6 characters (enforced on login DTO)

### Login
- ✅ **email**: Required, must be valid email format
- ✅ **password**: Required, minimum 6 characters
- ✅ **rememberMe**: Optional, boolean (default: false)

---

## Common Issues & Solutions

### Issue: "Email already registered"
**Solution:** Use a different email address or check if admin already exists

### Issue: "Invalid email or password"
**Solutions:**
- Verify email is correct
- Verify password is correct (case-sensitive)
- Check if admin account exists

### Issue: "Account is inactive"
**Solution:** Contact system administrator to reactivate the account

### Issue: Connection refused
**Solutions:**
- Ensure server is running on port 8080
- Check application.properties for correct port
- Verify MySQL database is running

---

## Next Steps After Login

Once you receive the login response:

1. **Save the access token** - Store `accessToken` for authenticated requests
2. **Save user details** - Store `userId`, `email`, `role` for app state
3. **Use the token** - Include in Authorization header for protected endpoints:
   ```
   Authorization: Bearer {accessToken}
   ```

Example authenticated request:
```bash
curl -X GET http://localhost:8080/api/admin/1 \
  -H "Authorization: Bearer mock_token_1_1732233600000"
```

---

## Testing Workflow

### Step 1: Start the Server
```bash
cd "C:\Users\A APH\Documents\ING4-Cours\Agile method\biometric-staff-attendance-mgt\Back-end\Fingerprint-management"
mvn spring-boot:run
```

### Step 2: Create First Admin
```bash
curl -X POST http://localhost:8080/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super",
    "surname": "Admin",
    "email": "admin@company.com",
    "password": "password123"
  }'
```

### Step 3: Login
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123"
  }'
```

### Step 4: Use the Token
Save the returned `accessToken` and use it in subsequent requests!

---

## Security Notes

⚠️ **Current Implementation:**
- Passwords are encrypted with BCrypt ✅
- Token is a mock placeholder (not JWT) ⚠️
- CSRF is disabled (suitable for API) ✅
- CORS allows all origins (configure for production) ⚠️

🔒 **For Production:**
- Implement proper JWT tokens
- Configure CORS whitelist
- Add rate limiting
- Enable HTTPS
- Implement refresh tokens
- Add account lockout after failed attempts

---

## Quick Reference

| Action | Method | Endpoint | Body Fields |
|--------|--------|----------|-------------|
| Create Admin | POST | `/api/admin/register` | name, surname, email, password |
| Login Admin | POST | `/api/admin/login` | email, password, rememberMe |
| Get All Admins | GET | `/api/admin` | - |
| Get Admin by ID | GET | `/api/admin/{id}` | - |
| Update Admin | PUT | `/api/admin/{id}` | name, surname, email, active |
| Change Password | POST | `/api/admin/{id}/change-password` | oldPassword, newPassword |
| Deactivate | POST | `/api/admin/{id}/deactivate` | - |
| Delete | DELETE | `/api/admin/{id}` | - |

---

Ready to test! 🚀

