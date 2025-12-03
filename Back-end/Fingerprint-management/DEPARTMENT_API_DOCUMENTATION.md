# Department Management API Documentation

## Overview
Complete CRUD operations for Department management in the Biometric Staff Attendance Management System.

---

## DTOs

### DepartmentRequestDTO (Create/Update Department)
```json
{
  "dpmtName": "Engineering"
}
```

### DepartmentResponseDTO (Standard Response)
```json
{
  "dpmtId": 1,
  "dpmtName": "Engineering",
  "totalStaff": 25,
  "activeStaff": 23,
  "totalReports": 10
}
```

### DepartmentDetailDTO (Detailed Response with Staff List)
```json
{
  "dpmtId": 1,
  "dpmtName": "Engineering",
  "totalStaff": 25,
  "activeStaff": 23,
  "totalReports": 10,
  "staffList": [
    {
      "userId": 1,
      "fullName": "John Doe",
      "email": "john.doe@company.com",
      "active": true,
      "noAbsence": 2
    }
  ]
}
```

---

## API Endpoints

### 1. Create Department
**POST** `/api/department`

**Request Body:**
```json
{
  "dpmtName": "Engineering"
}
```

**Response (201 Created):**
```json
{
  "dpmtId": 1,
  "dpmtName": "Engineering",
  "totalStaff": 0,
  "activeStaff": 0,
  "totalReports": 0
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Department name already exists: Engineering"
}
```

---

### 2. Get All Departments
**GET** `/api/department`

**Response (200 OK):**
```json
[
  {
    "dpmtId": 1,
    "dpmtName": "Engineering",
    "totalStaff": 25,
    "activeStaff": 23,
    "totalReports": 10
  },
  {
    "dpmtId": 2,
    "dpmtName": "HR",
    "totalStaff": 8,
    "activeStaff": 8,
    "totalReports": 5
  }
]
```

---

### 3. Get Department by ID
**GET** `/api/department/{id}`

**Example:** `/api/department/1`

**Response (200 OK):**
```json
{
  "dpmtId": 1,
  "dpmtName": "Engineering",
  "totalStaff": 25,
  "activeStaff": 23,
  "totalReports": 10
}
```

---

### 4. Get Department Details (with Staff List)
**GET** `/api/department/{id}/details`

**Example:** `/api/department/1/details`

**Response (200 OK):**
```json
{
  "dpmtId": 1,
  "dpmtName": "Engineering",
  "totalStaff": 25,
  "activeStaff": 23,
  "totalReports": 10,
  "staffList": [
    {
      "userId": 1,
      "fullName": "John Doe",
      "email": "john.doe@company.com",
      "active": true,
      "noAbsence": 2
    },
    {
      "userId": 2,
      "fullName": "Jane Smith",
      "email": "jane.smith@company.com",
      "active": true,
      "noAbsence": 0
    }
  ]
}
```

---

### 5. Get Department by Name
**GET** `/api/department/name?name={name}`

**Example:** `/api/department/name?name=Engineering`

**Response (200 OK):** Same as Get Department by ID

---

### 6. Search Departments by Name
**GET** `/api/department/search?query={query}`

**Example:** `/api/department/search?query=eng`

**Description:** Case-insensitive partial match search

**Response (200 OK):**
```json
[
  {
    "dpmtId": 1,
    "dpmtName": "Engineering",
    "totalStaff": 25,
    "activeStaff": 23,
    "totalReports": 10
  }
]
```

---

### 7. Get Departments with Staff
**GET** `/api/department/with-staff`

**Description:** Returns only departments that have at least one staff member

**Response (200 OK):** List of departments with staff

---

### 8. Get Empty Departments
**GET** `/api/department/empty`

**Description:** Returns departments with no staff members

**Response (200 OK):** List of departments without staff

---

### 9. Update Department
**PUT** `/api/department/{id}`

**Example:** `/api/department/1`

**Request Body:**
```json
{
  "dpmtName": "Engineering Department"
}
```

**Response (200 OK):**
```json
{
  "dpmtId": 1,
  "dpmtName": "Engineering Department",
  "totalStaff": 25,
  "activeStaff": 23,
  "totalReports": 10
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Department name already exists: HR"
}
```

---

### 10. Delete Department (Safe)
**DELETE** `/api/department/{id}`

**Example:** `/api/department/1`

**Description:** Deletes department ONLY if it has no staff members

**Response (200 OK):**
```json
{
  "message": "Department deleted successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Cannot delete department with existing staff. Please reassign or remove staff first."
}
```

---

### 11. Force Delete Department
**DELETE** `/api/department/{id}/force`

**Example:** `/api/department/1/force`

**⚠️ Warning:** This will delete the department even if it has staff members. Use with caution!

**Response (200 OK):**
```json
{
  "message": "Department force deleted successfully",
  "warning": "All associated staff have been removed"
}
```

---

### 12. Check Department Name Exists
**GET** `/api/department/check-name?name={name}`

**Example:** `/api/department/check-name?name=Engineering`

**Response (200 OK):**
```json
{
  "exists": true
}
```

---

### 13. Get Department Statistics
**GET** `/api/department/{id}/statistics`

**Example:** `/api/department/1/statistics`

**Response (200 OK):**
```json
{
  "dpmtId": 1,
  "dpmtName": "Engineering",
  "totalStaff": 25,
  "activeStaff": 23,
  "totalReports": 10
}
```

---

## Complete Examples

### Using cURL

#### Create Department
```bash
curl -X POST http://localhost:8080/api/department \
  -H "Content-Type: application/json" \
  -d '{"dpmtName": "Engineering"}'
```

#### Get All Departments
```bash
curl http://localhost:8080/api/department
```

#### Get Department with Staff Details
```bash
curl http://localhost:8080/api/department/1/details
```

#### Update Department
```bash
curl -X PUT http://localhost:8080/api/department/1 \
  -H "Content-Type: application/json" \
  -d '{"dpmtName": "Engineering Department"}'
```

#### Search Departments
```bash
curl http://localhost:8080/api/department/search?query=eng
```

#### Delete Department (Safe)
```bash
curl -X DELETE http://localhost:8080/api/department/1
```

#### Force Delete Department
```bash
curl -X DELETE http://localhost:8080/api/department/1/force
```

---

### Using Postman

#### Create Department
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/department`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "dpmtName": "Engineering"
}
```

#### Get Department Details
1. **Method:** GET
2. **URL:** `http://localhost:8080/api/department/1/details`

---

### Using JavaScript (Fetch API)

#### Create Department
```javascript
fetch('http://localhost:8080/api/department', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    dpmtName: 'Engineering'
  })
})
.then(response => response.json())
.then(data => console.log('Department created:', data))
.catch(error => console.error('Error:', error));
```

#### Get All Departments with Staff
```javascript
fetch('http://localhost:8080/api/department/with-staff')
  .then(response => response.json())
  .then(departments => {
    departments.forEach(dept => {
      console.log(`${dept.dpmtName}: ${dept.totalStaff} staff members`);
    });
  });
```

#### Get Department Details
```javascript
fetch('http://localhost:8080/api/department/1/details')
  .then(response => response.json())
  .then(data => {
    console.log(`Department: ${data.dpmtName}`);
    console.log('Staff Members:');
    data.staffList.forEach(staff => {
      console.log(`- ${staff.fullName} (${staff.email})`);
    });
  });
```

---

### Using Python (Requests)

#### Create Department
```python
import requests

url = "http://localhost:8080/api/department"
payload = {
    "dpmtName": "Engineering"
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

#### Get Department with Staff
```python
import requests

url = "http://localhost:8080/api/department/1/details"
response = requests.get(url)
data = response.json()

print(f"Department: {data['dpmtName']}")
print(f"Total Staff: {data['totalStaff']}")
print("Staff Members:")
for staff in data['staffList']:
    print(f"  - {staff['fullName']} ({staff['email']})")
```

---

## Field Validation Rules

### DepartmentRequestDTO
- ✅ **dpmtName**: Required, not blank
- ✅ **dpmtName**: Must be between 2 and 100 characters
- ✅ **dpmtName**: Must be unique (checked during create/update)

---

## Features Implemented

✅ **Create** - Create new department with validation  
✅ **Read** - Get by ID, name, search, list all  
✅ **Update** - Modify department name  
✅ **Delete** - Safe delete (no staff) or force delete  
✅ **Search** - Case-insensitive partial name search  
✅ **Statistics** - Staff count, active staff, reports count  
✅ **Details** - Get department with full staff list  
✅ **Filtering** - Get departments with/without staff  
✅ **Validation** - Check name uniqueness  

---

## Business Rules

### Delete Operations
1. **Safe Delete** (`DELETE /api/department/{id}`):
   - ✅ Checks if department has staff
   - ❌ Prevents deletion if staff exists
   - ✅ Requires manual staff reassignment first

2. **Force Delete** (`DELETE /api/department/{id}/force`):
   - ⚠️ Deletes department with staff
   - ⚠️ All staff associations are removed
   - ⚠️ Use with extreme caution!

### Update Operations
- ✅ Department name must be unique
- ✅ Cannot change name to existing department name
- ✅ Staff associations are preserved

---

## Error Handling

### Common Errors

#### 400 Bad Request
```json
{
  "error": "Department name already exists: Engineering"
}
```

#### 404 Not Found
```json
{
  "error": "Department not found with ID: 1"
}
```

---

## Statistics & Analytics

Each department response includes:
- **totalStaff**: Total number of staff members
- **activeStaff**: Number of active staff members
- **totalReports**: Number of reports associated with department

Use the `/details` endpoint to get the full staff list with:
- User ID
- Full name
- Email
- Active status
- Absence count

---

## Integration with Staff Management

Departments are tightly integrated with Staff:
- Staff are assigned to departments during creation
- Department statistics update automatically
- Staff can be reassigned to different departments
- Department deletion validates staff associations

---

## Quick Reference Table

| Action | Method | Endpoint | Query Params |
|--------|--------|----------|--------------|
| Create | POST | `/api/department` | - |
| Get All | GET | `/api/department` | - |
| Get by ID | GET | `/api/department/{id}` | - |
| Get Details | GET | `/api/department/{id}/details` | - |
| Get by Name | GET | `/api/department/name` | `name` |
| Search | GET | `/api/department/search` | `query` |
| With Staff | GET | `/api/department/with-staff` | - |
| Empty | GET | `/api/department/empty` | - |
| Update | PUT | `/api/department/{id}` | - |
| Delete | DELETE | `/api/department/{id}` | - |
| Force Delete | DELETE | `/api/department/{id}/force` | - |
| Check Name | GET | `/api/department/check-name` | `name` |
| Statistics | GET | `/api/department/{id}/statistics` | - |

---

## Testing Workflow

### Step 1: Create Departments
```bash
curl -X POST http://localhost:8080/api/department \
  -H "Content-Type: application/json" \
  -d '{"dpmtName": "Engineering"}'

curl -X POST http://localhost:8080/api/department \
  -H "Content-Type: application/json" \
  -d '{"dpmtName": "HR"}'
```

### Step 2: View All Departments
```bash
curl http://localhost:8080/api/department
```

### Step 3: Add Staff to Department
```bash
curl -X POST http://localhost:8080/api/staff \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "surname": "Doe",
    "email": "john@company.com",
    "password": "password123",
    "departmentId": 1
  }'
```

### Step 4: View Department with Staff
```bash
curl http://localhost:8080/api/department/1/details
```

---

Ready to use! 🚀

