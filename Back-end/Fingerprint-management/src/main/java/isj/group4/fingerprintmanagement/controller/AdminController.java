package isj.group4.fingerprintmanagement.controller;

import isj.group4.fingerprintmanagement.dto.AdminLoginRequestDTO;
import isj.group4.fingerprintmanagement.dto.AdminLoginResponseDTO;
import isj.group4.fingerprintmanagement.entity.Admin;
import isj.group4.fingerprintmanagement.services.AdminService;
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
 * REST Controller for Admin operations.
 * Provides endpoints for authentication and admin management.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Log4j2
@CrossOrigin(origins = "*") // Configure appropriately for production
public class AdminController {

    private final AdminService adminService;

//    /**
//     * Admin login endpoint.
//     *
//     * @param loginRequest the login credentials
//     * @return AdminLoginResponseDTO with authentication token
//     */
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequestDTO loginRequest) {
//        try {
//            AdminLoginResponseDTO response = adminService.authenticateAdmin(loginRequest);
//            return ResponseEntity.ok(response);
//        } catch (IllegalArgumentException e) {
//            log.error("Login failed: {}", e.getMessage());
//            Map<String, String> error = new HashMap<>();
//            error.put("error", e.getMessage());
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
//        }
//    }

//    /**
//     * Register new admin endpoint.
//     *
//     * @param admin the admin to register
//     * @return the registered admin
//     */
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@Valid @RequestBody Admin admin) {
//        try {
//            Admin registered = adminService.registerAdmin(admin);
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Admin registered successfully");
//            response.put("adminId", registered.getUserId());
//            response.put("email", registered.getEmail());
//            return ResponseEntity.status(HttpStatus.CREATED).body(response);
//        } catch (IllegalArgumentException e) {
//            log.error("Registration failed: {}", e.getMessage());
//            Map<String, String> error = new HashMap<>();
//            error.put("error", e.getMessage());
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
//        }
//    }

    /**
     * Get all admins.
     *
     * @return list of all admins
     */
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    /**
     * Get admin by ID.
     *
     * @param id the admin ID
     * @return the admin
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        return adminService.findAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update admin details.
     *
     * @param id the admin ID
     * @param admin the updated admin data
     * @return the updated admin
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        try {
            Admin updated = adminService.updateAdmin(id, admin);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Change admin password.
     *
     * @param id the admin ID
     * @param passwordChange containing old and new passwords
     * @return success message
     */
    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordChange) {
        try {
            String oldPassword = passwordChange.get("oldPassword");
            String newPassword = passwordChange.get("newPassword");

            adminService.changePassword(id, oldPassword, newPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Deactivate admin account.
     *
     * @param id the admin ID
     * @return success message
     */
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateAdmin(@PathVariable Long id) {
        try {
            adminService.deactivateAdmin(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin deactivated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Reactivate admin account.
     *
     * @param id the admin ID
     * @return success message
     */
    @PostMapping("/{id}/reactivate")
    public ResponseEntity<?> reactivateAdmin(@PathVariable Long id) {
        try {
            adminService.reactivateAdmin(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin reactivated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Delete admin permanently.
     *
     * @param id the admin ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        try {
            adminService.deleteAdmin(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Check if email exists.
     *
     * @param email the email to check
     * @return existence status
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = adminService.emailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}

