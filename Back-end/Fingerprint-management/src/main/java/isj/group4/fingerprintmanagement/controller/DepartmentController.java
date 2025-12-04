package isj.group4.fingerprintmanagement.controller;

import isj.group4.fingerprintmanagement.dto.DepartmentDetailDTO;
import isj.group4.fingerprintmanagement.dto.DepartmentRequestDTO;
import isj.group4.fingerprintmanagement.dto.DepartmentResponseDTO;
import isj.group4.fingerprintmanagement.services.DepartmentService;
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
 * REST Controller for Department management operations.
 * Provides complete CRUD endpoints for departments.
 */
@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@Log4j2
@CrossOrigin(origins = "*") // Configure appropriately for production
public class DepartmentController {

    private final DepartmentService departmentService;

    /**
     * Create a new department.
     * POST /api/department
     *
     * @param requestDTO the department creation request
     * @return the created department
     */
    @PostMapping
    public ResponseEntity<?> createDepartment(@Valid @RequestBody DepartmentRequestDTO requestDTO) {
        try {
            DepartmentResponseDTO response = departmentService.createDepartment(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Department creation failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all departments.
     * GET /api/department
     *
     * @return list of all departments with statistics
     */
    @GetMapping
    public ResponseEntity<List<DepartmentResponseDTO>> getAllDepartments() {
        List<DepartmentResponseDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    /**
     * Get department by ID.
     * GET /api/department/{id}
     *
     * @param id the department ID
     * @return the department details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartmentById(@PathVariable Long id) {
        try {
            DepartmentResponseDTO department = departmentService.getDepartmentById(id);
            return ResponseEntity.ok(department);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get detailed department information with staff list.
     * GET /api/department/{id}/details
     *
     * @param id the department ID
     * @return the detailed department information
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getDepartmentDetails(@PathVariable Long id) {
        try {
            DepartmentDetailDTO details = departmentService.getDepartmentDetails(id);
            return ResponseEntity.ok(details);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get department by name.
     * GET /api/department/name?name=xxx
     *
     * @param name the department name
     * @return the department details
     */
    @GetMapping("/name")
    public ResponseEntity<?> getDepartmentByName(@RequestParam String name) {
        try {
            DepartmentResponseDTO department = departmentService.getDepartmentByName(name);
            return ResponseEntity.ok(department);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Search departments by name (partial match).
     * GET /api/department/search?query=xxx
     *
     * @param query the search query
     * @return list of matching departments
     */
    @GetMapping("/search")
    public ResponseEntity<List<DepartmentResponseDTO>> searchDepartments(@RequestParam String query) {
        List<DepartmentResponseDTO> departments = departmentService.searchDepartmentsByName(query);
        return ResponseEntity.ok(departments);
    }

    /**
     * Get departments with staff.
     * GET /api/department/with-staff
     *
     * @return list of departments that have staff
     */
    @GetMapping("/with-staff")
    public ResponseEntity<List<DepartmentResponseDTO>> getDepartmentsWithStaff() {
        List<DepartmentResponseDTO> departments = departmentService.getDepartmentsWithStaff();
        return ResponseEntity.ok(departments);
    }

    /**
     * Get empty departments.
     * GET /api/department/empty
     *
     * @return list of departments with no staff
     */
    @GetMapping("/empty")
    public ResponseEntity<List<DepartmentResponseDTO>> getEmptyDepartments() {
        List<DepartmentResponseDTO> departments = departmentService.getEmptyDepartments();
        return ResponseEntity.ok(departments);
    }

    /**
     * Update department.
     * PUT /api/department/{id}
     *
     * @param id the department ID
     * @param requestDTO the update data
     * @return the updated department
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequestDTO requestDTO) {
        try {
            DepartmentResponseDTO updated = departmentService.updateDepartment(id, requestDTO);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            log.error("Department update failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Delete department (safe - only if no staff).
     * DELETE /api/department/{id}
     *
     * @param id the department ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        try {
            departmentService.deleteDepartment(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Department deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Force delete department (deletes with staff - use with caution).
     * DELETE /api/department/{id}/force
     *
     * @param id the department ID
     * @return success message
     */
    @DeleteMapping("/{id}/force")
    public ResponseEntity<?> forceDeleteDepartment(@PathVariable Long id) {
        try {
            departmentService.forceDeleteDepartment(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Department force deleted successfully");
            response.put("warning", "All associated staff have been removed");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Check if department name exists.
     * GET /api/department/check-name?name=xxx
     *
     * @param name the department name to check
     * @return existence status
     */
    @GetMapping("/check-name")
    public ResponseEntity<Map<String, Boolean>> checkDepartmentName(@RequestParam String name) {
        boolean exists = departmentService.departmentNameExists(name);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    /**
     * Get department statistics.
     * GET /api/department/{id}/statistics
     *
     * @param id the department ID
     * @return department statistics
     */
    @GetMapping("/{id}/statistics")
    public ResponseEntity<?> getDepartmentStatistics(@PathVariable Long id) {
        try {
            DepartmentResponseDTO stats = departmentService.getDepartmentStatistics(id);
            return ResponseEntity.ok(stats);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}

