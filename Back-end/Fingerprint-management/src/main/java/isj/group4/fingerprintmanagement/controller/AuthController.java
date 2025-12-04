package isj.group4.fingerprintmanagement.controller;

import isj.group4.fingerprintmanagement.dto.AdminLoginRequestDTO;
import isj.group4.fingerprintmanagement.dto.AdminLoginResponseDTO;
import isj.group4.fingerprintmanagement.entity.Admin;
import isj.group4.fingerprintmanagement.services.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/auth"})
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AdminService adminService;

    /**
          * Register new admin endpoint.
          *
          * @param admin the admin to register
          * @return the registered admin
          */
    @PostMapping("/admin/register")
    public ResponseEntity<?> register(@Valid @RequestBody Admin admin) {
        try {
            Admin registered = adminService.registerAdmin(admin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin registered successfully");
            response.put("adminId", registered.getUserId());
            response.put("email", registered.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Registration failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

       /**
          * Admin login endpoint.
          *
          * @param loginRequest the login credentials
          * @return AdminLoginResponseDTO with authentication token
          */
    @PostMapping("/admin/login")
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequestDTO loginRequest) {
        try {
            AdminLoginResponseDTO response = adminService.authenticateAdmin(loginRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Login failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}