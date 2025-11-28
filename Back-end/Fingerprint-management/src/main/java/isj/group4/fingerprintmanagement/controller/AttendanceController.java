package isj.group4.fingerprintmanagement.controller;

import isj.group4.fingerprintmanagement.dto.AttendanceRequestDTO;
import isj.group4.fingerprintmanagement.dto.AttendanceResponseDTO;
import isj.group4.fingerprintmanagement.services.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Attendance management operations.
 * Provides endpoints for recording and retrieving attendance records.
 */
@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Log4j2
@CrossOrigin(origins = "*") // Configure appropriately for production
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * Record attendance (arrival or departure).
     * POST /api/attendance/record
     *
     * Logic:
     * - If no attendance exists for the staff on the given date, create with arrival time
     * - If attendance exists with only arrival time, set departure time
     * - If both times are already set, return error
     *
     * @param requestDTO the attendance recording request
     * @return the recorded attendance details
     */
    @PostMapping("/record")
    public ResponseEntity<?> recordAttendance(@Valid @RequestBody AttendanceRequestDTO requestDTO) {
        try {
            log.info("Received attendance record request for staff ID: {}", requestDTO.getStaffId());
            AttendanceResponseDTO response = attendanceService.recordAttendance(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Attendance recording failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (IllegalStateException e) {
            log.error("Attendance already complete: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        } catch (Exception e) {
            log.error("Unexpected error recording attendance: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get attendance by ID.
     * GET /api/attendance/{id}
     *
     * @param id the attendance ID
     * @return the attendance details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAttendanceById(@PathVariable Long id) {
        try {
            AttendanceResponseDTO response = attendanceService.getAttendanceByIdAsDTO(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Attendance not found: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get all attendances.
     * GET /api/attendance
     *
     * @return list of all attendance records
     */
    @GetMapping
    public ResponseEntity<List<AttendanceResponseDTO>> getAllAttendances() {
        log.info("Fetching all attendance records");
        List<AttendanceResponseDTO> attendances = attendanceService.getAllAttendancesAsDTO();
        return ResponseEntity.ok(attendances);
    }

    /**
     * Get attendances by date.
     * GET /api/attendance/date/{date}
     *
     * @param date the attendance date (format: yyyy-MM-dd)
     * @return list of attendances for the specified date
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<?> getAttendancesByDate(@PathVariable String date) {
        try {
            log.info("Fetching attendances for date: {}", date);
            List<AttendanceResponseDTO> attendances = attendanceService.getAttendancesByDateAsDTO(date);
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            log.error("Error fetching attendances by date: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid date format. Use yyyy-MM-dd");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get attendances by staff ID.
     * GET /api/attendance/staff/{staffId}
     *
     * @param staffId the staff user ID
     * @return list of attendances for the specified staff
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<AttendanceResponseDTO>> getStaffAttendances(@PathVariable Long staffId) {
        log.info("Fetching attendances for staff ID: {}", staffId);
        List<AttendanceResponseDTO> attendances = attendanceService.getStaffAttendancesAsDTO(staffId);
        return ResponseEntity.ok(attendances);
    }

    /**
     * Get attendances by department ID.
     * GET /api/attendance/department/{departmentId}
     *
     * @param departmentId the department ID
     * @return list of attendances for the specified department
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendancesByDepartment(
            @PathVariable Long departmentId) {
        log.info("Fetching attendances for department ID: {}", departmentId);
        List<AttendanceResponseDTO> attendances =
                attendanceService.getAllAttendancesByDepartmentAsDTO(departmentId);
        return ResponseEntity.ok(attendances);
    }

    /**
     * Get attendance for a specific staff on a specific date.
     * GET /api/attendance/staff/{staffId}/date/{date}
     *
     * @param staffId the staff user ID
     * @param date the attendance date (format: yyyy-MM-dd)
     * @return attendance record for the staff on the specified date
     */
    @GetMapping("/staff/{staffId}/date/{date}")
    public ResponseEntity<?> getStaffAttendanceByDate(
            @PathVariable Long staffId,
            @PathVariable String date) {
        try {
            log.info("Fetching attendance for staff ID: {} on date: {}", staffId, date);
            List<AttendanceResponseDTO> attendances = attendanceService
                    .getAllAttendancesByStaffAndDate(staffId, date)
                    .stream()
                    .map(att -> attendanceService.getAttendanceByIdAsDTO(att.getAttendanceId()))
                    .toList();

            if (attendances.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No attendance found for this staff on the specified date");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            return ResponseEntity.ok(attendances.get(0));
        } catch (Exception e) {
            log.error("Error fetching staff attendance by date: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid date format. Use yyyy-MM-dd");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}

