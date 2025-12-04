# Attendance Records Integration Guide

## Overview
This guide explains how the Angular frontend calls the Spring Boot backend API to display attendance records.

---

## Setup & Configuration

### 1. Backend Configuration (Already Done ✅)

**API Endpoint:** `http://localhost:8080/api/attendance`

**Controller:** `AttendanceController.java`
- Located at: `Back-end/Fingerprint-management/src/main/java/isj/group4/fingerprintmanagement/controller/AttendanceController.java`
- CORS enabled with `@CrossOrigin(origins = "*")`

**Available Endpoints:**
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/{id}` - Get by ID
- `GET /api/attendance/date/{date}` - Get by date
- `GET /api/attendance/staff/{staffId}` - Get staff attendances
- `GET /api/attendance/department/{departmentId}` - Get by department
- `POST /api/attendance/record` - Record attendance (clock in/out)

### 2. Frontend Configuration (Already Done ✅)

**Service:** `attendance.ts`
- Located at: `Agile-Web/src/app/services/attendance.ts`
- Uses Angular HttpClient to call backend APIs
- Converts backend DTOs to frontend models automatically

**Component:** `attendance-records.ts`
- Located at: `Agile-Web/src/app/pages/attendance-records/attendance-records.ts`
- Displays attendance records in a table
- Includes loading states and error handling

**Models:** `attendance.ts`
- Located at: `Agile-Web/src/app/models/attendance.ts`
- Includes both frontend and backend DTO interfaces

---

## How It Works

### Data Flow

```
1. User Opens Attendance Records Page
   ↓
2. Component calls: attendanceService.getAllAttendance()
   ↓
3. Service makes HTTP GET request to: http://localhost:8080/api/attendance
   ↓
4. Backend returns AttendanceResponseDTO[] (JSON)
   ↓
5. Service converts DTOs to Attendance[] models
   ↓
6. Component displays data in table
```

### Backend Response Format

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

### Frontend Model After Conversion

```typescript
{
  id: "1",
  staffId: "1",
  staffName: "John Doe",
  department: "Engineering",
  date: new Date("2025-11-28"),
  checkIn: "08:30",
  checkOut: "17:45",
  hoursWorked: 9.3,
  status: "present"
}
```

---

## Testing the Integration

### Step 1: Start the Backend Server

1. Open terminal in `Back-end/Fingerprint-management`
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   Or run from your IDE

3. Verify server is running:
   ```bash
   curl http://localhost:8080/api/attendance
   ```

### Step 2: Start the Angular Development Server

1. Open terminal in `Agile-Web`
2. Install dependencies (if not done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open browser to: `http://localhost:4200`

### Step 3: Navigate to Attendance Records

1. Log in to the application
2. Click on "Attendance Records" in the navigation menu
3. The page should:
   - Show "Loading attendance records..." initially
   - Display all attendance records in a table
   - Allow searching by name, department, or date
   - Show refresh and export buttons

### Step 4: Verify Data is Loading

**Expected Behavior:**
- ✅ Table displays attendance records from backend
- ✅ Each row shows: Date, Staff Name, Department, Check In, Check Out, Hours, Status
- ✅ Search functionality works
- ✅ Refresh button reloads data
- ✅ Export button downloads CSV

**If you see an error:**
- Check browser console (F12) for error messages
- Verify backend is running on port 8080
- Check CORS is enabled in backend
- Verify database has attendance data

---

## Common Issues & Solutions

### Issue 1: "Failed to load attendance records: Error Code: 0"

**Cause:** Backend server is not running or not accessible.

**Solution:**
1. Start the backend server
2. Verify it's running: `curl http://localhost:8080/api/attendance`
3. Check firewall settings

### Issue 2: Empty Table (No Records)

**Cause:** Database has no attendance records.

**Solution:**
1. Use Postman to create test attendance records:
   ```json
   POST http://localhost:8080/api/attendance/record
   {
     "staffId": 1,
     "attendanceDate": "2025-11-28",
     "attendanceTime": "2025-11-28T08:30:00"
   }
   ```

2. Or insert test data directly in database:
   ```sql
   INSERT INTO attendances (staff_id, attendance_date, arrival_time, departure_time)
   VALUES (1, '2025-11-28', '2025-11-28 08:30:00', '2025-11-28 17:45:00');
   ```

### Issue 3: CORS Error in Browser Console

**Symptom:** 
```
Access to XMLHttpRequest at 'http://localhost:8080/api/attendance' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solution:**
Verify `@CrossOrigin(origins = "*")` is present in `AttendanceController.java`

### Issue 4: Date Parsing Error

**Symptom:** 
```
JSON parse error: Cannot deserialize value of type `java.time.LocalDateTime`
```

**Solution:**
Ensure date format is correct:
- Date: `"2025-11-28"` (yyyy-MM-dd)
- DateTime: `"2025-11-28T08:30:00"` (yyyy-MM-ddTHH:mm:ss)

---

## API Usage Examples

### Get All Attendances

**TypeScript (in component):**
```typescript
this.attendanceService.getAllAttendance().subscribe({
  next: (records) => {
    console.log('Loaded records:', records);
    this.attendanceRecords = records;
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### Get Attendances by Date

```typescript
const today = '2025-11-28';
this.attendanceService.getAttendancesByDate(today).subscribe({
  next: (records) => {
    console.log('Today\'s records:', records);
  }
});
```

### Get Staff Attendances

```typescript
const staffId = 1;
this.attendanceService.getStaffAttendances(staffId).subscribe({
  next: (records) => {
    console.log('Staff attendance history:', records);
  }
});
```

### Record Attendance (Clock In/Out)

```typescript
const request = {
  staffId: 1,
  attendanceDate: '2025-11-28',
  attendanceTime: '2025-11-28T08:30:00'
};

this.attendanceService.recordAttendance(request).subscribe({
  next: (response) => {
    console.log('Attendance recorded:', response.status);
  },
  error: (error) => {
    console.error('Failed to record:', error);
  }
});
```

---

## Features Implemented

### ✅ Backend (Spring Boot)
- Complete REST API with 7 endpoints
- DTO-based request/response
- Validation with Jakarta Validation
- Error handling with proper HTTP status codes
- CORS configuration
- Logging with Log4j2

### ✅ Frontend (Angular)
- HttpClient service for API calls
- Automatic DTO to model conversion
- Loading states
- Error handling with user-friendly messages
- Search functionality
- Export to CSV
- Refresh button
- Responsive table display

---

## Next Steps

### Add More Features

1. **Filtering by Date Range**
   ```typescript
   getAttendancesByDateRange(startDate: string, endDate: string): Observable<Attendance[]> {
     // Implement filtering logic
   }
   ```

2. **Real-time Updates with WebSocket**
   - Push new attendance records to frontend automatically

3. **Pagination**
   - Add pagination for large datasets

4. **Advanced Search**
   - Filter by status (present, absent, late)
   - Filter by department
   - Filter by date range

5. **Attendance Recording UI**
   - Add a button to record attendance from the web interface
   - Implement biometric integration

---

## Testing Checklist

- [ ] Backend server starts successfully
- [ ] API endpoint returns data: `curl http://localhost:8080/api/attendance`
- [ ] Frontend development server starts
- [ ] Attendance Records page loads without errors
- [ ] Table displays attendance records
- [ ] Search functionality works
- [ ] Refresh button reloads data
- [ ] Export button downloads CSV
- [ ] Error messages display when backend is down
- [ ] Loading indicator shows while fetching data

---

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Check backend logs
3. Verify database connection
4. Review the API documentation: `ATTENDANCE_API_DOCUMENTATION.md`

**Backend API Documentation:** `Back-end/Fingerprint-management/ATTENDANCE_API_DOCUMENTATION.md`

**Backend Controller:** `Back-end/Fingerprint-management/src/main/java/isj/group4/fingerprintmanagement/controller/AttendanceController.java`

**Frontend Service:** `Agile-Web/src/app/services/attendance.ts`

**Frontend Component:** `Agile-Web/src/app/pages/attendance-records/attendance-records.ts`

