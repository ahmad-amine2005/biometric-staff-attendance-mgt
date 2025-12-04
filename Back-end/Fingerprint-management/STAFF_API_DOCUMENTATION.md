# Staff Management API Documentation

## Overview
Complete CRUD operations for Staff management in the Biometric Staff Attendance Management System.

---

## DTOs

### StaffRequestDTO (Create Staff)
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@company.com",
  "departmentId": 1,
  "noAbsence": 0,
  "role": "STAFF",
  "active": true,
  "noDaysPerWeek_contract": 5,
  "startTime_contract": "2025-11-29T08:00:00",
  "endTime_contract": "2025-11-29T17:00:00"
}
```

### StaffUpdateDTO (Update Staff)
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@company.com",
  "departmentId": 1,
  "noAbsence": 2,
  "active": true
}
```

### StaffResponseDTO (Response)
```json
{
  "userId": 6,
  "name": "John",
  "surname": "Doe",
  "email": "john.doe5@company.com",
  "role": "STAFF",
  "active": true,
  "noAbsence": 0,
  "departmentId": 1,
  "departmentName": "Engineering",
  "contractId": 3,
  "contractStatus": "Active",
  "totalAttendances": 0
}
```

---

## API Endpoints

### 1. Create Staff
**POST** `/api/staff`

**Request Body:**
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john.doe5@company.com",
  "departmentId": 1,
  "noDaysPerWeek_contract": 5,
  "startTime_contract": "2025-11-29T08:00:00",
  "endTime_contract": "2025-11-29T17:00:00"
}
```

**Response (201 Created):**
```json
{
  "userId": 6,
  "name": "John",
  "surname": "Doe",
  "email": "john.doe5@company.com",
  "role": "STAFF",
  "active": true,
  "noAbsence": 0,
  "departmentId": 1,
  "departmentName": "Engineering",
  "contractId": 3,
  "contractStatus": "Active",
  "totalAttendances": 0
}
```

---

### 2. Get All Staff
**GET** `/api/staff`

**Response (200 OK):**
```json
[
  {
    "userId": 2,
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@company.com",
    "role": "STAFF",
    "active": true,
    "noAbsence": 0,
    "departmentId": 1,
    "departmentName": "Engineering",
    "contractId": null,
    "contractStatus": "No Contract",
    "totalAttendances": 1
  }
]
```

---

### 3. Get All Active Staff
**GET** `/api/staff/active`

**Response (200 OK):** List of active staff only

---

### 4. Get Staff by ID
**GET** `/api/staff/{id}`

**Example:** `/api/staff/1`

**Response (200 OK):**
```json
{
  "userId": 1,
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@company.com",
  "fullName": "John Doe",
  "noAbsence": 2,
  "role": "ROLE_STAFF",
  "active": true,
  "departmentId": 1,
  "departmentName": "Engineering",
  "contractId": 5,
  "contractStatus": "Active",
  "totalAttendances": 45
}
```

---

### 5. Get Staff by Email
**GET** `/api/staff/email?email={email}`

**Example:** `/api/staff/email?email=john.doe@company.com`

---

### 6. Get Staff by Department
**GET** `/api/staff/department/{departmentId}`

**Example:** `/api/staff/department/1`

**Response:** List of all staff in the department

---

### 7. Get Active Staff by Department
**GET** `/api/staff/department/{departmentId}/active`

**Example:** `/api/staff/department/1/active`

**Response:** List of active staff in the department

---

### 8. Update Staff
**PUT** `/api/staff/{id}`

**Request Body:**
```json
{
  "name": "John Updated",
  "surname": "Doe",
  "email": "john.updated@company.com",
  "departmentId": 2,
  "noAbsence": 3,
  "active": true
}
```

**Response (200 OK):** Updated staff details

---

### 9. Change Staff Password
**POST** `/api/staff/{id}/change-password`

**Request Body:**
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

### 10. Increment Absence
**POST** `/api/staff/{id}/increment-absence`

**Response (200 OK):** Updated staff with incremented absence count

---

### 11. Reset Absence
**POST** `/api/staff/{id}/reset-absence`

**Response (200 OK):** Updated staff with absence count reset to 0

---

### 12. Deactivate Staff
**POST** `/api/staff/{id}/deactivate`

**Response (200 OK):**
```json
{
  "message": "Staff deactivated successfully"
}
```

---

### 13. Reactivate Staff
**POST** `/api/staff/{id}/reactivate`

**Response (200 OK):**
```json
{
  "message": "Staff reactivated successfully"
}
```

---

### 14. Delete Staff
**DELETE** `/api/staff/{id}`

**Response (200 OK):**
```json
{
  "message": "Staff deleted successfully"
}
```

---

### 15. Check Email Exists
**GET** `/api/staff/check-email?email={email}`

**Example:** `/api/staff/check-email?email=john.doe@company.com`

**Response (200 OK):**
```json
{
  "exists": true
}
```

---

### 16. Count Staff by Department
**GET** `/api/staff/department/{departmentId}/count`

**Example:** `/api/staff/department/1/count`

**Response (200 OK):**
```json
{
  "count": 25
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email already registered"
}
```

### 404 Not Found
```json
{
  "error": "Staff not found with ID: 1"
}
```

---

## Features Implemented

✅ **Create** - Register new staff with validation  
✅ **Read** - Get staff by ID, email, department, or all staff  
✅ **Update** - Modify staff details (except password)  
✅ **Delete** - Soft delete (deactivate) or hard delete  
✅ **Password Management** - Secure password change with verification  
✅ **Absence Tracking** - Increment and reset absence counts  
✅ **Department Filtering** - Get staff by department  
✅ **Active/Inactive Status** - Manage staff account status  
✅ **Email Validation** - Check for duplicate emails  
✅ **Statistics** - Count staff by department, view attendance count  

---

## Security Features

- ✅ Password encryption using BCrypt
- ✅ Validation using Bean Validation annotations
- ✅ Transaction management for data integrity
- ✅ Comprehensive logging for audit trails
- ✅ Proper error handling with meaningful messages

---

## Testing Examples (using curl)

### Create Staff
```bash
curl -X POST http://localhost:8080/api/staff \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "surname": "Smith",
    "email": "jane.smith@company.com",
    "password": "password123",
    "departmentId": 1
  }'
```

### Get All Staff
```bash
curl http://localhost:8080/api/staff
```

### Update Staff
```bash
curl -X PUT http://localhost:8080/api/staff/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Updated",
    "departmentId": 2
  }'
```

### Change Password
```bash
curl -X POST http://localhost:8080/api/staff/1/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newPassword456"
  }'
```

### Delete Staff
```bash
curl -X DELETE http://localhost:8080/api/staff/1
```

---

## Notes

- All passwords are automatically encrypted before storage
- Deactivation is preferred over deletion for audit trails
- Email addresses must be unique across all staff members
- Department must exist before creating staff
- All endpoints support JSON request/response format

