package isj.group4.fingerprintmanagement.controller;

import isj.group4.fingerprintmanagement.dto.StaffRequestDTO;
import isj.group4.fingerprintmanagement.dto.StaffResponseDTO;
import isj.group4.fingerprintmanagement.dto.StaffUpdateDTO;
import isj.group4.fingerprintmanagement.services.StaffService;
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
 * REST Controller for Staff management operations.
 * Provides complete CRUD endpoints for staff members.
 */
@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Log4j2
@CrossOrigin(origins = "*") // Configure appropriately for production
public class StaffController {

    private final StaffService staffService;

    /**
     * Create a new staff member.
     * POST /api/staff
     *
     * @param staffRequest the staff creation request
     * @return the created staff
     */
    @PostMapping
    public ResponseEntity<?> createStaff(@Valid @RequestBody StaffRequestDTO staffRequest) {
        try {
            StaffResponseDTO response = staffService.createStaff(staffRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Staff creation failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all staff members.
     * GET /api/staff
     *
     * @return list of all staff
     */
    @GetMapping
    public ResponseEntity<List<StaffResponseDTO>> getAllStaff() {
        List<StaffResponseDTO> staff = staffService.getAllStaff();
        return ResponseEntity.ok(staff);
    }

    /**
     * Get all active staff members.
     * GET /api/staff/active
     *
     * @return list of active staff
     */
    @GetMapping("/active")
    public ResponseEntity<List<StaffResponseDTO>> getAllActiveStaff() {
        List<StaffResponseDTO> staff = staffService.getAllActiveStaff();
        return ResponseEntity.ok(staff);
    }

    /**
     * Get staff by ID.
     * GET /api/staff/{id}
     *
     * @param id the staff ID
     * @return the staff details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getStaffById(@PathVariable Long id) {
        try {
            StaffResponseDTO staff = staffService.getStaffById(id);
            return ResponseEntity.ok(staff);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get staff by email.
     * GET /api/staff/email?email=xxx
     *
     * @param email the staff email
     * @return the staff details
     */
    @GetMapping("/email")
    public ResponseEntity<?> getStaffByEmail(@RequestParam String email) {
        return staffService.getStaffByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get staff by department.
     * GET /api/staff/department/{departmentId}
     *
     * @param departmentId the department ID
     * @return list of staff in the department
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<StaffResponseDTO>> getStaffByDepartment(@PathVariable Long departmentId) {
        List<StaffResponseDTO> staff = staffService.getStaffByDepartment(departmentId);
        return ResponseEntity.ok(staff);
    }

    /**
     * Get active staff by department.
     * GET /api/staff/department/{departmentId}/active
     *
     * @param departmentId the department ID
     * @return list of active staff in the department
     */
    @GetMapping("/department/{departmentId}/active")
    public ResponseEntity<List<StaffResponseDTO>> getActiveStaffByDepartment(@PathVariable Long departmentId) {
        List<StaffResponseDTO> staff = staffService.getActiveStaffByDepartment(departmentId);
        return ResponseEntity.ok(staff);
    }

    /**
     * Update staff details.
     * PUT /api/staff/{id}
     *
     * @param id the staff ID
     * @param updateDTO the update data
     * @return the updated staff
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id, @Valid @RequestBody StaffUpdateDTO updateDTO) {
        try {
            StaffResponseDTO updated = staffService.updateStaff(id, updateDTO);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            log.error("Staff update failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }



    /**
     * Increment staff absence count.
     * POST /api/staff/{id}/increment-absence
     *
     * @param id the staff ID
     * @return the updated staff
     */
    @PostMapping("/{id}/increment-absence")
    public ResponseEntity<?> incrementAbsence(@PathVariable Long id) {
        try {
            StaffResponseDTO updated = staffService.incrementAbsence(id);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Reset staff absence count.
     * POST /api/staff/{id}/reset-absence
     *
     * @param id the staff ID
     * @return the updated staff
     */
    @PostMapping("/{id}/reset-absence")
    public ResponseEntity<?> resetAbsence(@PathVariable Long id) {
        try {
            StaffResponseDTO updated = staffService.resetAbsence(id);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Deactivate staff account.
     * POST /api/staff/{id}/deactivate
     *
     * @param id the staff ID
     * @return success message
     */
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateStaff(@PathVariable Long id) {
        try {
            staffService.deactivateStaff(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Staff deactivated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Reactivate staff account.
     * POST /api/staff/{id}/reactivate
     *
     * @param id the staff ID
     * @return success message
     */
    @PostMapping("/{id}/reactivate")
    public ResponseEntity<?> reactivateStaff(@PathVariable Long id) {
        try {
            staffService.reactivateStaff(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Staff reactivated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Delete staff permanently.
     * DELETE /api/staff/{id}
     *
     * @param id the staff ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        try {
            staffService.deleteStaff(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Staff deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Check if email exists.
     * GET /api/staff/check-email?email=xxx
     *
     * @param email the email to check
     * @return existence status
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = staffService.emailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    /**
     * Count staff by department.
     * GET /api/staff/department/{departmentId}/count
     *
     * @param departmentId the department ID
     * @return staff count
     */
    @GetMapping("/department/{departmentId}/count")
    public ResponseEntity<Map<String, Long>> countStaffByDepartment(@PathVariable Long departmentId) {
        long count = staffService.countStaffByDepartment(departmentId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}

