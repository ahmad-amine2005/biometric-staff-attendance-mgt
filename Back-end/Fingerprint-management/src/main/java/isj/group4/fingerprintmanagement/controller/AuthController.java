package isj.group4.fingerprintmanagement.controller;

import isj.group4.fingerprintmanagement.dto.AdminLoginRequestDTO;
import isj.group4.fingerprintmanagement.dto.AdminLoginResponseDTO;
import isj.group4.fingerprintmanagement.entity.Admin;
import isj.group4.fingerprintmanagement.services.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AdminService adminService;

    /**
     * Register a new admin account
     */
    @PostMapping("admin/register")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        log.info("Received registration request for admin: {}", admin.getEmail());
        Admin savedAdmin = adminService.registerAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    /**
     * Authenticate an admin and return JWT + metadata
     */
    @PostMapping("admin/login")
    public ResponseEntity<AdminLoginResponseDTO> loginAdmin(@RequestBody AdminLoginRequestDTO loginRequest) {
        log.info("Received login request for admin: {}", loginRequest.getEmail());
        AdminLoginResponseDTO response = adminService.authenticateAdmin(loginRequest);
        return ResponseEntity.ok(response);
    }
}