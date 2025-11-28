# Attendance Management API Documentation

## Overview
Complete API documentation for Attendance recording and management in the Biometric Staff Attendance Management System.

**Base URL:** `http://localhost:8080/api/attendance`

---

## Table of Contents
1. [DTOs Overview](#dtos-overview)
2. [API Endpoints](#api-endpoints)
3. [Postman Testing Guide](#postman-testing-guide)
4. [Code Examples](#code-examples)
5. [Error Handling & Troubleshooting](#error-handling--troubleshooting)

---

## DTOs Overview

### AttendanceRequestDTO (Record Attendance)
Used for recording attendance (arrival or departure).

```json
{
  "staffId": 1,
  "attendanceDate": "2025-11-28",
  "attendanceTime": "2025-11-28T08:30:00"
}
```

**Field Descriptions:**
- `staffId` (Long, required): The ID of the staff member recording attendance
- `attendanceDate` (LocalDate, required): The date of attendance in format `yyyy-MM-dd`
- `attendanceTime` (LocalDateTime, required): The timestamp of the attendance record in format `yyyy-MM-dd'T'HH:mm:ss`

**Business Logic:**
- If no attendance exists for the staff on the given date → creates new record with `attendanceTime` as **arrival time**
- If attendance exists with only arrival time → updates with `attendanceTime` as **departure time**
- If both arrival and departure times are already set → returns error

---

### AttendanceResponseDTO (Response)
Returned by all GET endpoints and after recording attendance.

```json
{
  "attendanceId": 1,
  "attendanceDate": "2025-11-28",
  "arrivalTime": "2025-11-28T08:30:00",
  "departureTime": "2025-11-28T17:45:00",
  "staffId": 1,
  "staffName": "John",
  "staffSurname": "Doe",
  "staffEmail": "john.doe@company.com",
  "departmentId": 2,
  "departmentName": "Engineering",
  "status": "COMPLETE"
}
```

**Field Descriptions:**
- `attendanceId` (Long): Unique identifier for the attendance record
- `attendanceDate` (LocalDate): Date of attendance
- `arrivalTime` (LocalDateTime): Timestamp when staff arrived (null if not recorded)
- `departureTime` (LocalDateTime): Timestamp when staff departed (null if not recorded)
- `staffId` (Long): Staff member's user ID
- `staffName` (String): Staff member's first name
- `staffSurname` (String): Staff member's surname
- `staffEmail` (String): Staff member's email
- `departmentId` (Long): Department ID (null if not assigned)
- `departmentName` (String): Department name (null if not assigned)
- `status` (String): Current status of attendance record

**Status Values:**
- `ARRIVAL_RECORDED`: Only arrival time is set
- `DEPARTURE_RECORDED`: Departure time was just recorded
- `COMPLETE`: Both arrival and departure times are set
- `INCOMPLETE`: Neither time is set (unusual case)

---

## API Endpoints

### 1. Record Attendance (Arrival/Departure)

**Endpoint:** `POST /api/attendance/record`

**Description:** Records staff attendance. Automatically determines if this is an arrival (clock in) or departure (clock out) based on existing records.

**Request Body:**
```json
{
  "staffId": 1,
  "attendanceDate": "2025-11-28",
  "attendanceTime": "2025-11-28T08:30:00"
}
```

**Success Response (201 Created):**
```json
{
  "attendanceId": 1,
  "attendanceDate": "2025-11-28",
  "arrivalTime": "2025-11-28T08:30:00",
  "departureTime": null,
  "staffId": 1,
  "staffName": "John",
  "staffSurname": "Doe",
  "staffEmail": "john.doe@company.com",
  "departmentId": 2,
  "departmentName": "Engineering",
  "status": "ARRIVAL_RECORDED"
}
```

**Error Responses:**

**400 Bad Request** - Invalid input:
```json
{
  "error": "Staff ID is required"
}
```

**400 Bad Request** - Staff not found:
```json
{
  "error": "Staff not found with ID: 999"
}
```

**409 Conflict** - Attendance already complete:
```json
{
  "error": "Attendance already complete for staff ID: 1 on date: 2025-11-28"
}
```

**500 Internal Server Error** - Unexpected error:
```json
{
  "error": "An unexpected error occurred"
}
```

---

### 2. Get Attendance by ID

**Endpoint:** `GET /api/attendance/{id}`

**Description:** Retrieves a specific attendance record by its ID.

**Path Parameter:**
- `id` (Long): The attendance record ID

**Example Request:**
```
GET http://localhost:8080/api/attendance/1
```

**Success Response (200 OK):**
```json
{
  "attendanceId": 1,
  "attendanceDate": "2025-11-28",
  "arrivalTime": "2025-11-28T08:30:00",
  "departureTime": "2025-11-28T17:45:00",
  "staffId": 1,
  "staffName": "John",
  "staffSurname": "Doe",
  "staffEmail": "john.doe@company.com",
  "departmentId": 2,
  "departmentName": "Engineering",
  "status": "COMPLETE"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Attendance not found with ID: 999"
}
```

---

### 3. Get All Attendances

**Endpoint:** `GET /api/attendance`

**Description:** Retrieves all attendance records in the system.

**Example Request:**
```
GET http://localhost:8080/api/attendance
```

**Success Response (200 OK):**
```json
[
  {
    "attendanceId": 1,
    "attendanceDate": "2025-11-28",
    "arrivalTime": "2025-11-28T08:30:00",
    "departureTime": "2025-11-28T17:45:00",
    "staffId": 1,
    "staffName": "John",
    "staffSurname": "Doe",
    "staffEmail": "john.doe@company.com",
    "departmentId": 2,
    "departmentName": "Engineering",
    "status": "COMPLETE"
  },
  {
    "attendanceId": 2,
    "attendanceDate": "2025-11-28",
    "arrivalTime": "2025-11-28T09:00:00",
    "departureTime": null,
    "staffId": 2,
    "staffName": "Jane",
    "staffSurname": "Smith",
    "staffEmail": "jane.smith@company.com",
    "departmentId": 3,
    "departmentName": "HR",
    "status": "ARRIVAL_RECORDED"
  }
]
```

---

### 4. Get Attendances by Date

**Endpoint:** `GET /api/attendance/date/{date}`

**Description:** Retrieves all attendance records for a specific date.

**Path Parameter:**
- `date` (String): The attendance date in format `yyyy-MM-dd`

**Example Request:**
```
GET http://localhost:8080/api/attendance/date/2025-11-28
```

**Success Response (200 OK):**
```json
[
  {
    "attendanceId": 1,
    "attendanceDate": "2025-11-28",
    "arrivalTime": "2025-11-28T08:30:00",
    "departureTime": "2025-11-28T17:45:00",
    "staffId": 1,
    "staffName": "John",
    "staffSurname": "Doe",
    "staffEmail": "john.doe@company.com",
    "departmentId": 2,
    "departmentName": "Engineering",
    "status": "COMPLETE"
  }
]
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid date format. Use yyyy-MM-dd"
}
```

---

### 5. Get Attendances by Staff ID

**Endpoint:** `GET /api/attendance/staff/{staffId}`

**Description:** Retrieves all attendance records for a specific staff member.

**Path Parameter:**
- `staffId` (Long): The staff user ID

**Example Request:**
```
GET http://localhost:8080/api/attendance/staff/1
```

**Success Response (200 OK):**
```json
[
  {
    "attendanceId": 1,
    "attendanceDate": "2025-11-28",
    "arrivalTime": "2025-11-28T08:30:00",
    "departureTime": "2025-11-28T17:45:00",
    "staffId": 1,
    "staffName": "John",
    "staffSurname": "Doe",
    "staffEmail": "john.doe@company.com",
    "departmentId": 2,
    "departmentName": "Engineering",
    "status": "COMPLETE"
  },
  {
    "attendanceId": 15,
    "attendanceDate": "2025-11-27",
    "arrivalTime": "2025-11-27T08:15:00",
    "departureTime": "2025-11-27T17:30:00",
    "staffId": 1,
    "staffName": "John",
    "staffSurname": "Doe",
    "staffEmail": "john.doe@company.com",
    "departmentId": 2,
    "departmentName": "Engineering",
    "status": "COMPLETE"
  }
]
```

---

### 6. Get Attendances by Department ID

**Endpoint:** `GET /api/attendance/department/{departmentId}`

**Description:** Retrieves all attendance records for staff in a specific department.

**Path Parameter:**
- `departmentId` (Long): The department ID

**Example Request:**
```
GET http://localhost:8080/api/attendance/department/2
```

**Success Response (200 OK):**
```json
[
  {
    "attendanceId": 1,
    "attendanceDate": "2025-11-28",
    "arrivalTime": "2025-11-28T08:30:00",
    "departureTime": "2025-11-28T17:45:00",
    "staffId": 1,
    "staffName": "John",
    "staffSurname": "Doe",
    "staffEmail": "john.doe@company.com",
    "departmentId": 2,
    "departmentName": "Engineering",
    "status": "COMPLETE"
  }
]
```

---

### 7. Get Staff Attendance by Date

**Endpoint:** `GET /api/attendance/staff/{staffId}/date/{date}`

**Description:** Retrieves attendance record for a specific staff member on a specific date.

**Path Parameters:**
- `staffId` (Long): The staff user ID
- `date` (String): The attendance date in format `yyyy-MM-dd`

**Example Request:**
```
GET http://localhost:8080/api/attendance/staff/1/date/2025-11-28
```

**Success Response (200 OK):**
```json
{
  "attendanceId": 1,
  "attendanceDate": "2025-11-28",
  "arrivalTime": "2025-11-28T08:30:00",
  "departureTime": "2025-11-28T17:45:00",
  "staffId": 1,
  "staffName": "John",
  "staffSurname": "Doe",
  "staffEmail": "john.doe@company.com",
  "departmentId": 2,
  "departmentName": "Engineering",
  "status": "COMPLETE"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "No attendance found for this staff on the specified date"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid date format. Use yyyy-MM-dd"
}
```

---

## Postman Testing Guide

### Setup

1. **Create a New Collection**
   - Open Postman
   - Click "New" → "Collection"
   - Name it "Attendance Management API"

2. **Set Base URL Variable**
   - Click on your collection
   - Go to "Variables" tab
   - Add variable: `base_url` = `http://localhost:8080`

### Test Scenarios

#### Scenario 1: Record Staff Arrival (Clock In)

1. **Create New Request**
   - Method: `POST`
   - URL: `{{base_url}}/api/attendance/record`
   
2. **Headers:**
   ```
   Content-Type: application/json
   ```

3. **Body (raw JSON):**
   ```json
   {
     "staffId": 1,
     "attendanceDate": "2025-11-28",
     "attendanceTime": "2025-11-28T08:30:00"
   }
   ```

4. **Expected Response:** `201 Created`
   ```json
   {
     "attendanceId": 1,
     "attendanceDate": "2025-11-28",
     "arrivalTime": "2025-11-28T08:30:00",
     "departureTime": null,
     "staffId": 1,
     "staffName": "John",
     "staffSurname": "Doe",
     "staffEmail": "john.doe@company.com",
     "departmentId": 2,
     "departmentName": "Engineering",
     "status": "ARRIVAL_RECORDED"
   }
   ```

#### Scenario 2: Record Staff Departure (Clock Out)

1. **Create New Request**
   - Method: `POST`
   - URL: `{{base_url}}/api/attendance/record`

2. **Body (raw JSON):**
   ```json
   {
     "staffId": 1,
     "attendanceDate": "2025-11-28",
     "attendanceTime": "2025-11-28T17:45:00"
   }
   ```

3. **Expected Response:** `201 Created`
   ```json
   {
     "attendanceId": 1,
     "attendanceDate": "2025-11-28",
     "arrivalTime": "2025-11-28T08:30:00",
     "departureTime": "2025-11-28T17:45:00",
     "staffId": 1,
     "staffName": "John",
     "staffSurname": "Doe",
     "staffEmail": "john.doe@company.com",
     "departmentId": 2,
     "departmentName": "Engineering",
     "status": "DEPARTURE_RECORDED"
   }
   ```

#### Scenario 3: Get Attendance by ID

1. **Create New Request**
   - Method: `GET`
   - URL: `{{base_url}}/api/attendance/1`

2. **Expected Response:** `200 OK`

#### Scenario 4: Get All Attendances for Today

1. **Create New Request**
   - Method: `GET`
   - URL: `{{base_url}}/api/attendance/date/2025-11-28`

2. **Expected Response:** `200 OK` with array of attendances

#### Scenario 5: Get All Attendances for a Staff Member

1. **Create New Request**
   - Method: `GET`
   - URL: `{{base_url}}/api/attendance/staff/1`

2. **Expected Response:** `200 OK` with array of attendances

#### Scenario 6: Get Attendances by Department

1. **Create New Request**
   - Method: `GET`
   - URL: `{{base_url}}/api/attendance/department/2`

2. **Expected Response:** `200 OK` with array of attendances

#### Scenario 7: Get Specific Staff Attendance on Specific Date

1. **Create New Request**
   - Method: `GET`
   - URL: `{{base_url}}/api/attendance/staff/1/date/2025-11-28`

2. **Expected Response:** `200 OK` with single attendance record

### Postman Tests (Scripts)

Add these test scripts to validate responses:

**For POST /api/attendance/record:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has attendanceId", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('attendanceId');
});

pm.test("Response has correct staffId", function () {
    var jsonData = pm.response.json();
    var requestBody = JSON.parse(pm.request.body.raw);
    pm.expect(jsonData.staffId).to.eql(requestBody.staffId);
});

pm.test("Response has status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.be.oneOf(['ARRIVAL_RECORDED', 'DEPARTURE_RECORDED']);
});
```

**For GET requests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});
```

---

## Code Examples

### JavaScript (Fetch API)

#### Record Attendance (Clock In/Out)

```javascript
async function recordAttendance(staffId, attendanceDate, attendanceTime) {
    const url = 'http://localhost:8080/api/attendance/record';
    
    const requestBody = {
        staffId: staffId,
        attendanceDate: attendanceDate,      // Format: "2025-11-28"
        attendanceTime: attendanceTime        // Format: "2025-11-28T08:30:00"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to record attendance');
        }

        const data = await response.json();
        console.log('Attendance recorded successfully:', data);
        return data;
    } catch (error) {
        console.error('Error recording attendance:', error.message);
        throw error;
    }
}

// Usage Example
recordAttendance(1, "2025-11-28", "2025-11-28T08:30:00")
    .then(response => {
        console.log('Status:', response.status);
        console.log('Attendance ID:', response.attendanceId);
    })
    .catch(error => {
        console.error('Failed:', error);
    });
```

#### Get Attendance by ID

```javascript
async function getAttendanceById(attendanceId) {
    const url = `http://localhost:8080/api/attendance/${attendanceId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Attendance not found');
        }

        const data = await response.json();
        console.log('Attendance details:', data);
        return data;
    } catch (error) {
        console.error('Error fetching attendance:', error.message);
        throw error;
    }
}

// Usage
getAttendanceById(1)
    .then(attendance => {
        console.log('Arrival:', attendance.arrivalTime);
        console.log('Departure:', attendance.departureTime);
        console.log('Status:', attendance.status);
    });
```

#### Get All Attendances

```javascript
async function getAllAttendances() {
    const url = 'http://localhost:8080/api/attendance';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch attendances');
        }

        const data = await response.json();
        console.log('Total attendances:', data.length);
        return data;
    } catch (error) {
        console.error('Error fetching attendances:', error.message);
        throw error;
    }
}

// Usage
getAllAttendances()
    .then(attendances => {
        attendances.forEach(att => {
            console.log(`${att.staffName} ${att.staffSurname} - ${att.status}`);
        });
    });
```

#### Get Attendances by Date

```javascript
async function getAttendancesByDate(date) {
    const url = `http://localhost:8080/api/attendance/date/${date}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch attendances');
        }

        const data = await response.json();
        console.log(`Attendances for ${date}:`, data.length);
        return data;
    } catch (error) {
        console.error('Error fetching attendances by date:', error.message);
        throw error;
    }
}

// Usage
getAttendancesByDate("2025-11-28")
    .then(attendances => {
        console.log('Today\'s attendances:', attendances);
    });
```

#### Get Staff Attendances

```javascript
async function getStaffAttendances(staffId) {
    const url = `http://localhost:8080/api/attendance/staff/${staffId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch staff attendances');
        }

        const data = await response.json();
        console.log(`Total attendances for staff ${staffId}:`, data.length);
        return data;
    } catch (error) {
        console.error('Error fetching staff attendances:', error.message);
        throw error;
    }
}

// Usage
getStaffAttendances(1)
    .then(attendances => {
        console.log('Staff attendance history:', attendances);
    });
```

#### Get Attendances by Department

```javascript
async function getAttendancesByDepartment(departmentId) {
    const url = `http://localhost:8080/api/attendance/department/${departmentId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch department attendances');
        }

        const data = await response.json();
        console.log(`Total attendances for department ${departmentId}:`, data.length);
        return data;
    } catch (error) {
        console.error('Error fetching department attendances:', error.message);
        throw error;
    }
}

// Usage
getAttendancesByDepartment(2)
    .then(attendances => {
        console.log('Department attendances:', attendances);
    });
```

#### Get Staff Attendance by Date

```javascript
async function getStaffAttendanceByDate(staffId, date) {
    const url = `http://localhost:8080/api/attendance/staff/${staffId}/date/${date}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) {
                console.log(errorData.message);
                return null;
            }
            throw new Error(errorData.error || 'Failed to fetch attendance');
        }

        const data = await response.json();
        console.log('Attendance found:', data);
        return data;
    } catch (error) {
        console.error('Error fetching staff attendance by date:', error.message);
        throw error;
    }
}

// Usage
getStaffAttendanceByDate(1, "2025-11-28")
    .then(attendance => {
        if (attendance) {
            console.log('Status:', attendance.status);
        }
    });
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api/attendance';

// Record Attendance
async function recordAttendance(staffId, attendanceDate, attendanceTime) {
    try {
        const response = await axios.post(`${API_BASE_URL}/record`, {
            staffId: staffId,
            attendanceDate: attendanceDate,
            attendanceTime: attendanceTime
        });
        console.log('Attendance recorded:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error:', error.response.data.error);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
}

// Get Attendance by ID
async function getAttendanceById(attendanceId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/${attendanceId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response?.data?.error || error.message);
        throw error;
    }
}

// Get All Attendances
async function getAllAttendances() {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Get Attendances by Date
async function getAttendancesByDate(date) {
    try {
        const response = await axios.get(`${API_BASE_URL}/date/${date}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response?.data?.error || error.message);
        throw error;
    }
}

// Get Staff Attendances
async function getStaffAttendances(staffId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/staff/${staffId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Usage Example
(async () => {
    try {
        // Record arrival
        const arrival = await recordAttendance(1, "2025-11-28", "2025-11-28T08:30:00");
        console.log('Arrival recorded:', arrival.status);

        // Record departure
        const departure = await recordAttendance(1, "2025-11-28", "2025-11-28T17:45:00");
        console.log('Departure recorded:', departure.status);

        // Get today's attendances
        const todayAttendances = await getAttendancesByDate("2025-11-28");
        console.log('Today\'s count:', todayAttendances.length);
    } catch (error) {
        console.error('Operation failed');
    }
})();
```

---

### Python (requests library)

#### Record Attendance (Clock In/Out)

```python
import requests
from datetime import datetime
import json

API_BASE_URL = "http://localhost:8080/api/attendance"

def record_attendance(staff_id, attendance_date, attendance_time):
    """
    Record attendance for a staff member.
    
    Args:
        staff_id (int): Staff user ID
        attendance_date (str): Date in format "YYYY-MM-DD"
        attendance_time (str): DateTime in format "YYYY-MM-DDTHH:MM:SS"
    
    Returns:
        dict: Response data containing attendance details
    """
    url = f"{API_BASE_URL}/record"
    
    payload = {
        "staffId": staff_id,
        "attendanceDate": attendance_date,
        "attendanceTime": attendance_time
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for 4xx/5xx status codes
        
        data = response.json()
        print(f"Attendance recorded successfully: {data['status']}")
        return data
        
    except requests.exceptions.HTTPError as http_err:
        error_data = response.json()
        print(f"HTTP error occurred: {error_data.get('error', str(http_err))}")
        raise
    except Exception as err:
        print(f"An error occurred: {err}")
        raise

# Usage Example
if __name__ == "__main__":
    try:
        # Record arrival
        arrival_response = record_attendance(
            staff_id=1,
            attendance_date="2025-11-28",
            attendance_time="2025-11-28T08:30:00"
        )
        print(f"Arrival Time: {arrival_response['arrivalTime']}")
        print(f"Status: {arrival_response['status']}")
        
    except Exception as e:
        print(f"Failed to record attendance: {e}")
```

#### Get Attendance by ID

```python
def get_attendance_by_id(attendance_id):
    """
    Retrieve a specific attendance record by ID.
    
    Args:
        attendance_id (int): The attendance record ID
    
    Returns:
        dict: Attendance details
    """
    url = f"{API_BASE_URL}/{attendance_id}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(f"Attendance found for {data['staffName']} {data['staffSurname']}")
        return data
        
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 404:
            error_data = response.json()
            print(f"Not found: {error_data.get('error')}")
        else:
            print(f"HTTP error: {http_err}")
        raise
    except Exception as err:
        print(f"Error: {err}")
        raise

# Usage
try:
    attendance = get_attendance_by_id(1)
    print(f"Date: {attendance['attendanceDate']}")
    print(f"Arrival: {attendance['arrivalTime']}")
    print(f"Departure: {attendance['departureTime']}")
    print(f"Status: {attendance['status']}")
except Exception:
    pass
```

#### Get All Attendances

```python
def get_all_attendances():
    """
    Retrieve all attendance records.
    
    Returns:
        list: List of all attendance records
    """
    url = API_BASE_URL
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(f"Total attendances retrieved: {len(data)}")
        return data
        
    except Exception as err:
        print(f"Error fetching attendances: {err}")
        raise

# Usage
try:
    attendances = get_all_attendances()
    for att in attendances:
        print(f"{att['staffName']} {att['staffSurname']} - {att['status']}")
except Exception:
    pass
```

#### Get Attendances by Date

```python
def get_attendances_by_date(date):
    """
    Retrieve all attendance records for a specific date.
    
    Args:
        date (str): Date in format "YYYY-MM-DD"
    
    Returns:
        list: List of attendance records for the date
    """
    url = f"{API_BASE_URL}/date/{date}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(f"Attendances for {date}: {len(data)}")
        return data
        
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 400:
            error_data = response.json()
            print(f"Bad request: {error_data.get('error')}")
        else:
            print(f"HTTP error: {http_err}")
        raise
    except Exception as err:
        print(f"Error: {err}")
        raise

# Usage
try:
    today_attendances = get_attendances_by_date("2025-11-28")
    for att in today_attendances:
        print(f"{att['staffName']} - Arrival: {att['arrivalTime']}")
except Exception:
    pass
```

#### Get Staff Attendances

```python
def get_staff_attendances(staff_id):
    """
    Retrieve all attendance records for a specific staff member.
    
    Args:
        staff_id (int): Staff user ID
    
    Returns:
        list: List of attendance records for the staff
    """
    url = f"{API_BASE_URL}/staff/{staff_id}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(f"Total attendances for staff {staff_id}: {len(data)}")
        return data
        
    except Exception as err:
        print(f"Error: {err}")
        raise

# Usage
try:
    staff_attendances = get_staff_attendances(1)
    for att in staff_attendances:
        print(f"Date: {att['attendanceDate']} - Status: {att['status']}")
except Exception:
    pass
```

#### Get Attendances by Department

```python
def get_attendances_by_department(department_id):
    """
    Retrieve all attendance records for a specific department.
    
    Args:
        department_id (int): Department ID
    
    Returns:
        list: List of attendance records for the department
    """
    url = f"{API_BASE_URL}/department/{department_id}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(f"Total attendances for department {department_id}: {len(data)}")
        return data
        
    except Exception as err:
        print(f"Error: {err}")
        raise

# Usage
try:
    dept_attendances = get_attendances_by_department(2)
    print(f"Department: {dept_attendances[0]['departmentName']}")
    for att in dept_attendances:
        print(f"{att['staffName']} - {att['attendanceDate']}")
except Exception:
    pass
```

#### Get Staff Attendance by Date

```python
def get_staff_attendance_by_date(staff_id, date):
    """
    Retrieve attendance record for a specific staff on a specific date.
    
    Args:
        staff_id (int): Staff user ID
        date (str): Date in format "YYYY-MM-DD"
    
    Returns:
        dict: Attendance record or None if not found
    """
    url = f"{API_BASE_URL}/staff/{staff_id}/date/{date}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(f"Attendance found for staff {staff_id} on {date}")
        return data
        
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 404:
            error_data = response.json()
            print(f"Not found: {error_data.get('message')}")
            return None
        elif response.status_code == 400:
            error_data = response.json()
            print(f"Bad request: {error_data.get('error')}")
        else:
            print(f"HTTP error: {http_err}")
        raise
    except Exception as err:
        print(f"Error: {err}")
        raise

# Usage
try:
    attendance = get_staff_attendance_by_date(1, "2025-11-28")
    if attendance:
        print(f"Status: {attendance['status']}")
        print(f"Arrival: {attendance['arrivalTime']}")
        print(f"Departure: {attendance['departureTime']}")
except Exception:
    pass
```

#### Complete Python Example with Error Handling

```python
import requests
from datetime import datetime, date, time
from typing import Optional, Dict, List

class AttendanceAPIClient:
    """Client for Attendance Management API"""
    
    def __init__(self, base_url: str = "http://localhost:8080/api/attendance"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def record_attendance(self, staff_id: int, 
                         attendance_date: str, 
                         attendance_time: str) -> Dict:
        """Record staff attendance (arrival or departure)"""
        url = f"{self.base_url}/record"
        payload = {
            "staffId": staff_id,
            "attendanceDate": attendance_date,
            "attendanceTime": attendance_time
        }
        
        response = self.session.post(url, json=payload)
        
        if response.status_code == 201:
            return response.json()
        elif response.status_code == 400:
            raise ValueError(response.json().get('error', 'Bad request'))
        elif response.status_code == 409:
            raise ValueError(response.json().get('error', 'Attendance already complete'))
        else:
            response.raise_for_status()
    
    def get_attendance_by_id(self, attendance_id: int) -> Dict:
        """Get specific attendance record by ID"""
        url = f"{self.base_url}/{attendance_id}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            raise ValueError(response.json().get('error', 'Attendance not found'))
        else:
            response.raise_for_status()
    
    def get_all_attendances(self) -> List[Dict]:
        """Get all attendance records"""
        response = self.session.get(self.base_url)
        response.raise_for_status()
        return response.json()
    
    def get_attendances_by_date(self, date: str) -> List[Dict]:
        """Get all attendances for a specific date"""
        url = f"{self.base_url}/date/{date}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 400:
            raise ValueError(response.json().get('error', 'Invalid date format'))
        else:
            response.raise_for_status()
    
    def get_staff_attendances(self, staff_id: int) -> List[Dict]:
        """Get all attendances for a specific staff member"""
        url = f"{self.base_url}/staff/{staff_id}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def get_attendances_by_department(self, department_id: int) -> List[Dict]:
        """Get all attendances for a specific department"""
        url = f"{self.base_url}/department/{department_id}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def get_staff_attendance_by_date(self, staff_id: int, date: str) -> Optional[Dict]:
        """Get attendance for a specific staff on a specific date"""
        url = f"{self.base_url}/staff/{staff_id}/date/{date}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            return None
        elif response.status_code == 400:
            raise ValueError(response.json().get('error', 'Invalid date format'))
        else:
            response.raise_for_status()

# Usage Example
if __name__ == "__main__":
    client = AttendanceAPIClient()
    
    try:
        # Record arrival
        print("Recording arrival...")
        arrival = client.record_attendance(
            staff_id=1,
            attendance_date="2025-11-28",
            attendance_time="2025-11-28T08:30:00"
        )
        print(f"✓ Arrival recorded - ID: {arrival['attendanceId']}, Status: {arrival['status']}")
        
        # Record departure
        print("\nRecording departure...")
        departure = client.record_attendance(
            staff_id=1,
            attendance_date="2025-11-28",
            attendance_time="2025-11-28T17:45:00"
        )
        print(f"✓ Departure recorded - Status: {departure['status']}")
        
        # Get today's attendances
        print("\nFetching today's attendances...")
        today = date.today().isoformat()
        today_attendances = client.get_attendances_by_date(today)
        print(f"✓ Found {len(today_attendances)} attendance(s) for today")
        
        # Get staff attendance history
        print("\nFetching staff attendance history...")
        staff_history = client.get_staff_attendances(1)
        print(f"✓ Found {len(staff_history)} total attendance(s) for staff")
        
        # Get specific attendance
        print("\nChecking staff attendance for today...")
        staff_today = client.get_staff_attendance_by_date(1, today)
        if staff_today:
            print(f"✓ Status: {staff_today['status']}")
            print(f"  Arrival: {staff_today['arrivalTime']}")
            print(f"  Departure: {staff_today['departureTime']}")
        else:
            print("✗ No attendance found")
        
    except ValueError as e:
        print(f"✗ Validation error: {e}")
    except requests.exceptions.RequestException as e:
        print(f"✗ API error: {e}")
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
```

---

## Error Handling & Troubleshooting

### Common HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 OK | Success | GET request completed successfully |
| 201 Created | Created | Attendance recorded successfully |
| 400 Bad Request | Invalid input | Missing required fields, invalid date format |
| 404 Not Found | Resource not found | Attendance ID or staff not found |
| 409 Conflict | State conflict | Attendance already complete for the day |
| 500 Internal Server Error | Server error | Database error, unexpected exception |

### Common Errors and Solutions

#### 1. "Staff not found with ID: X"

**Cause:** The staffId provided doesn't exist in the database.

**Solutions:**
- Verify the staff ID is correct
- Check if the staff record exists: `GET /api/staff/{staffId}`
- Ensure you're using the user ID, not a different identifier

**Example:**
```javascript
// Check if staff exists first
async function checkAndRecordAttendance(staffId) {
    try {
        const staffResponse = await fetch(`http://localhost:8080/api/staff/${staffId}`);
        if (!staffResponse.ok) {
            throw new Error('Staff not found');
        }
        
        // Now record attendance
        await recordAttendance(staffId, "2025-11-28", "2025-11-28T08:30:00");
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

#### 2. "Attendance already complete for staff ID: X on date: Y"

**Cause:** Both arrival and departure times are already recorded for this staff on this date.

**Solutions:**
- Check the existing attendance record first
- Create a new attendance record for a different date
- If correction is needed, contact administrator for database update

**Example:**
```javascript
async function safeRecordAttendance(staffId, date, time) {
    try {
        // Check existing attendance
        const existing = await getStaffAttendanceByDate(staffId, date);
        
        if (existing && existing.departureTime) {
            console.log('Attendance already complete for today');
            return existing;
        }
        
        // Record attendance
        return await recordAttendance(staffId, date, time);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

#### 3. "Invalid date format. Use yyyy-MM-dd"

**Cause:** Date parameter is not in the correct format.

**Solutions:**
- Ensure date is formatted as `yyyy-MM-dd` (e.g., `2025-11-28`)
- Ensure datetime is formatted as `yyyy-MM-dd'T'HH:mm:ss` (e.g., `2025-11-28T08:30:00`)

**Example:**
```javascript
// Correct date formatting
function formatDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateTime(dateObj) {
    const date = formatDate(dateObj);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return `${date}T${hours}:${minutes}:${seconds}`;
}

// Usage
const now = new Date();
const dateStr = formatDate(now);
const dateTimeStr = formatDateTime(now);

recordAttendance(1, dateStr, dateTimeStr);
```

**Python Example:**
```python
from datetime import datetime

# Correct date formatting
date_str = datetime.now().strftime("%Y-%m-%d")
datetime_str = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

record_attendance(1, date_str, datetime_str)
```

#### 4. Validation Errors (400 Bad Request)

**Possible validation errors:**
- `"Staff ID is required"`
- `"Attendance date is required"`
- `"Attendance time is required"`

**Solution:** Ensure all required fields are provided in the request body.

**Example with validation:**
```javascript
function validateAttendanceRequest(staffId, attendanceDate, attendanceTime) {
    if (!staffId) {
        throw new Error('Staff ID is required');
    }
    if (!attendanceDate) {
        throw new Error('Attendance date is required');
    }
    if (!attendanceTime) {
        throw new Error('Attendance time is required');
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(attendanceDate)) {
        throw new Error('Invalid date format. Use yyyy-MM-dd');
    }
    
    // Validate datetime format
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (!dateTimeRegex.test(attendanceTime)) {
        throw new Error('Invalid datetime format. Use yyyy-MM-ddTHH:mm:ss');
    }
}

// Usage
try {
    validateAttendanceRequest(staffId, attendanceDate, attendanceTime);
    await recordAttendance(staffId, attendanceDate, attendanceTime);
} catch (error) {
    console.error('Validation failed:', error.message);
}
```

#### 5. CORS Issues

**Symptom:** Error in browser console about CORS policy.

**Cause:** The API is configured with `@CrossOrigin(origins = "*")` but might be blocked in certain environments.

**Solutions:**
- For production, configure specific allowed origins
- Ensure requests include proper headers
- Check if proxy configuration is needed

#### 6. Connection Refused / Network Error

**Cause:** Backend server is not running or wrong URL.

**Solutions:**
- Verify the backend server is running on port 8080
- Check the base URL is correct
- Test with curl: `curl http://localhost:8080/api/attendance`

```bash
# Test if server is responding
curl http://localhost:8080/api/attendance
```

### Debugging Tips

#### 1. Enable Detailed Logging

The API uses Log4j2 for logging. Check application logs for detailed error information.

#### 2. Test with Curl

```bash
# Test recording attendance
curl -X POST http://localhost:8080/api/attendance/record \
  -H "Content-Type: application/json" \
  -d "{\"staffId\":1,\"attendanceDate\":\"2025-11-28\",\"attendanceTime\":\"2025-11-28T08:30:00\"}"

# Test getting attendance by ID
curl http://localhost:8080/api/attendance/1

# Test getting attendances by date
curl http://localhost:8080/api/attendance/date/2025-11-28
```

#### 3. Verify Database State

Check the database directly to verify data state:

```sql
-- Check staff exists
SELECT * FROM staff WHERE user_id = 1;

-- Check existing attendances
SELECT * FROM attendances WHERE staff_id = 1 AND attendance_date = '2025-11-28';

-- Check all attendances
SELECT a.*, s.name, s.surname 
FROM attendances a 
JOIN staff s ON a.staff_id = s.user_id 
ORDER BY a.attendance_date DESC;
```

### Best Practices

1. **Always validate input before sending requests**
   - Check staff ID exists
   - Validate date formats
   - Ensure required fields are present

2. **Handle errors gracefully**
   - Catch and log errors appropriately
   - Display user-friendly error messages
   - Implement retry logic for network errors

3. **Check existing state before recording**
   - Query existing attendance before recording departure
   - Prevent duplicate recordings

4. **Use appropriate date/time handling**
   - Use built-in date libraries (JavaScript Date, Python datetime)
   - Always use ISO 8601 format for consistency

5. **Implement proper error recovery**
   - Allow users to retry failed operations
   - Log errors for troubleshooting
   - Provide clear feedback on what went wrong

---

## Testing Workflow

### Complete Test Sequence

1. **Setup: Create a test staff member** (if not exists)
2. **Test 1: Record arrival** - Should succeed with status `ARRIVAL_RECORDED`
3. **Test 2: Verify arrival** - GET request should show arrival time set
4. **Test 3: Try duplicate arrival** - Should fail with 409 error
5. **Test 4: Record departure** - Should succeed with status `DEPARTURE_RECORDED`
6. **Test 5: Verify complete attendance** - Should show both times with status `COMPLETE`
7. **Test 6: Try third record** - Should fail with 409 error
8. **Test 7: Query by date** - Should return today's attendances
9. **Test 8: Query by staff** - Should return all staff's attendances
10. **Test 9: Query specific staff + date** - Should return the complete record

### Automated Test Script (JavaScript)

```javascript
async function runAttendanceTests() {
    const staffId = 1;
    const today = new Date().toISOString().split('T')[0];
    const arrivalTime = `${today}T08:30:00`;
    const departureTime = `${today}T17:45:00`;
    
    console.log('🧪 Starting Attendance API Tests...\n');
    
    // Test 1: Record Arrival
    try {
        console.log('Test 1: Recording arrival...');
        const arrival = await recordAttendance(staffId, today, arrivalTime);
        console.assert(arrival.status === 'ARRIVAL_RECORDED', 'Status should be ARRIVAL_RECORDED');
        console.assert(arrival.arrivalTime === arrivalTime, 'Arrival time should match');
        console.assert(arrival.departureTime === null, 'Departure time should be null');
        console.log('✓ Test 1 passed\n');
    } catch (error) {
        console.error('✗ Test 1 failed:', error.message, '\n');
    }
    
    // Test 2: Verify Arrival
    try {
        console.log('Test 2: Verifying arrival record...');
        const attendance = await getStaffAttendanceByDate(staffId, today);
        console.assert(attendance !== null, 'Attendance should exist');
        console.assert(attendance.arrivalTime !== null, 'Arrival time should be set');
        console.log('✓ Test 2 passed\n');
    } catch (error) {
        console.error('✗ Test 2 failed:', error.message, '\n');
    }
    
    // Test 3: Record Departure
    try {
        console.log('Test 3: Recording departure...');
        const departure = await recordAttendance(staffId, today, departureTime);
        console.assert(departure.status === 'DEPARTURE_RECORDED', 'Status should be DEPARTURE_RECORDED');
        console.assert(departure.departureTime === departureTime, 'Departure time should match');
        console.log('✓ Test 3 passed\n');
    } catch (error) {
        console.error('✗ Test 3 failed:', error.message, '\n');
    }
    
    // Test 4: Try to record third time (should fail)
    try {
        console.log('Test 4: Attempting third record (should fail)...');
        await recordAttendance(staffId, today, `${today}T18:00:00`);
        console.error('✗ Test 4 failed: Should have thrown error\n');
    } catch (error) {
        console.assert(error.message.includes('already complete'), 'Should indicate attendance is complete');
        console.log('✓ Test 4 passed (correctly rejected)\n');
    }
    
    // Test 5: Get all attendances for today
    try {
        console.log('Test 5: Getting all attendances for today...');
        const todayAttendances = await getAttendancesByDate(today);
        console.assert(todayAttendances.length > 0, 'Should have at least one attendance');
        console.log(`✓ Test 5 passed (found ${todayAttendances.length} attendances)\n`);
    } catch (error) {
        console.error('✗ Test 5 failed:', error.message, '\n');
    }
    
    console.log('🎉 Tests completed!');
}

// Run tests
runAttendanceTests();
```

---

## Additional Resources

### Related Documentation
- [Staff API Documentation](STAFF_API_DOCUMENTATION.md)
- [Department API Documentation](DEPARTMENT_API_DOCUMENTATION.md)
- [Admin Authentication Guide](ADMIN_AUTHENTICATION_GUIDE.md)

### API Architecture
- **Framework:** Spring Boot
- **Database:** JPA/Hibernate
- **Validation:** Jakarta Validation (Bean Validation)
- **Logging:** Log4j2

### Contact & Support
For issues or questions about the Attendance API:
1. Check the logs in the application console
2. Review this documentation
3. Contact the development team

---

**Document Version:** 1.0  
**Last Updated:** November 28, 2025  
**API Version:** Compatible with Fingerprint-management v1.0

