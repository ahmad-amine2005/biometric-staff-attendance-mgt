package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.dto.AdminLoginRequestDTO;
import isj.group4.fingerprintmanagement.dto.AdminLoginResponseDTO;
import isj.group4.fingerprintmanagement.entity.Admin;
import isj.group4.fingerprintmanagement.repository.AdminRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for Admin operations including authentication, CRUD, and business logic.
 * Follows best practices: logging, validation, transaction management, and proper exception handling.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class AdminService {

    private final AdminRepo adminRepo;
    private final AttendanceService attendanceService;
    private final ContractService contractService;
    private final PasswordEncoder passwordEncoder;

    // Token expiration constants
    private static final long SHORT_TOKEN_EXPIRY_SECONDS = 900; // 15 minutes
    private static final long LONG_TOKEN_EXPIRY_SECONDS = 604800; // 7 days

    /**
     * Authenticate admin and generate login response.
     *
     * @param loginRequest containing email and password
     * @return AdminLoginResponseDTO with token and admin details
     * @throws IllegalArgumentException if credentials are invalid
     */
    @Transactional(readOnly = true)
    public AdminLoginResponseDTO authenticateAdmin(AdminLoginRequestDTO loginRequest) {
        log.info("Authentication attempt for admin with email: {}", loginRequest.getEmail());

        // Find admin by email
        Admin admin = adminRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    log.warn("Authentication failed: Admin not found with email: {}", loginRequest.getEmail());
                    return new IllegalArgumentException("Invalid email or password");
                });

        // Check if account is active
        if (!admin.getActive()) {
            log.warn("Authentication failed: Admin account is inactive for email: {}", loginRequest.getEmail());
            throw new IllegalArgumentException("Account is inactive. Please contact administrator.");
        }

        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            log.warn("Authentication failed: Invalid password for email: {}", loginRequest.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate token (in a real application, use JWT)
        String accessToken = generateToken(admin);
        long expiresIn = loginRequest.isRememberMe() ? LONG_TOKEN_EXPIRY_SECONDS : SHORT_TOKEN_EXPIRY_SECONDS;

        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime expiresAt = issuedAt.plusSeconds(expiresIn);

        log.info("Authentication successful for admin: {} (ID: {})", admin.getEmail(), admin.getUserId());

        // Build and return response DTO
        return AdminLoginResponseDTO.builder()
                .userId(admin.getUserId())
                .email(admin.getEmail())
                .name(admin.getName())
                .surname(admin.getSurname())
                .fullName(admin.getName() + " " + admin.getSurname())
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .role(admin.getRole())
                .message("Login successful")
                .build();
    }

    /**
     * Register a new admin account.
     *
     * @param admin the admin entity to create
     * @return the created admin
     * @throws IllegalArgumentException if email already exists
     */
    @Transactional
    public Admin registerAdmin(Admin admin) {
        log.info("Attempting to register new admin with email: {}", admin.getEmail());

        // Check if email already exists
        if (adminRepo.existsByEmail(admin.getEmail())) {
            log.warn("Registration failed: Email already exists: {}", admin.getEmail());
            throw new IllegalArgumentException("Email already registered");
        }

        // Encode password before saving
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        // Set default role if not set
        if (admin.getRole() == null || admin.getRole().isEmpty()) {
            admin.setRole("ROLE_ADMIN");
        }

        // Set active by default
        if (admin.getActive() == null) {
            admin.setActive(true);
        }

        Admin savedAdmin = adminRepo.save(admin);
        log.info("Admin registered successfully: {} (ID: {})", savedAdmin.getEmail(), savedAdmin.getUserId());

        return savedAdmin;
    }

    /**
     * Find admin by ID.
     *
     * @param adminId the admin ID
     * @return Optional containing admin if found
     */
    @Transactional(readOnly = true)
    public Optional<Admin> findAdminById(Long adminId) {
        log.debug("Finding admin by ID: {}", adminId);
        return adminRepo.findById(adminId);
    }

    /**
     * Find admin by email.
     *
     * @param email the admin email
     * @return Optional containing admin if found
     */
    @Transactional(readOnly = true)
    public Optional<Admin> findAdminByEmail(String email) {
        log.debug("Finding admin by email: {}", email);
        return adminRepo.findByEmail(email);
    }

    /**
     * Get all admins.
     *
     * @return list of all admins
     */
    @Transactional(readOnly = true)
    public List<Admin> getAllAdmins() {
        log.debug("Retrieving all admins");
        return adminRepo.findAll();
    }

    /**
     * Update admin details.
     *
     * @param adminId the admin ID to update
     * @param updatedAdmin the updated admin data
     * @return the updated admin
     * @throws IllegalArgumentException if admin not found
     */
    @Transactional
    public Admin updateAdmin(Long adminId, Admin updatedAdmin) {
        log.info("Updating admin with ID: {}", adminId);

        Admin existingAdmin = adminRepo.findById(adminId)
                .orElseThrow(() -> {
                    log.warn("Update failed: Admin not found with ID: {}", adminId);
                    return new IllegalArgumentException("Admin not found with ID: " + adminId);
                });

        // Update fields (excluding password - use separate method)
        if (updatedAdmin.getName() != null) {
            existingAdmin.setName(updatedAdmin.getName());
        }
        if (updatedAdmin.getSurname() != null) {
            existingAdmin.setSurname(updatedAdmin.getSurname());
        }
        if (updatedAdmin.getEmail() != null && !updatedAdmin.getEmail().equals(existingAdmin.getEmail())) {
            // Check if new email already exists
            if (adminRepo.existsByEmail(updatedAdmin.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            existingAdmin.setEmail(updatedAdmin.getEmail());
        }
        if (updatedAdmin.getActive() != null) {
            existingAdmin.setActive(updatedAdmin.getActive());
        }

        Admin saved = adminRepo.save(existingAdmin);
        log.info("Admin updated successfully: {} (ID: {})", saved.getEmail(), saved.getUserId());

        return saved;
    }

    /**
     * Change admin password.
     *
     * @param adminId the admin ID
     * @param oldPassword the current password
     * @param newPassword the new password
     * @throws IllegalArgumentException if old password is incorrect or admin not found
     */
    @Transactional
    public void changePassword(Long adminId, String oldPassword, String newPassword) {
        log.info("Password change request for admin ID: {}", adminId);

        Admin admin = adminRepo.findById(adminId)
                .orElseThrow(() -> {
                    log.warn("Password change failed: Admin not found with ID: {}", adminId);
                    return new IllegalArgumentException("Admin not found");
                });

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, admin.getPassword())) {
            log.warn("Password change failed: Incorrect old password for admin ID: {}", adminId);
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Validate new password
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }

        // Update password
        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepo.save(admin);

        log.info("Password changed successfully for admin ID: {}", adminId);
    }

    /**
     * Deactivate admin account (soft delete).
     *
     * @param adminId the admin ID to deactivate
     * @throws IllegalArgumentException if admin not found
     */
    @Transactional
    public void deactivateAdmin(Long adminId) {
        log.info("Deactivating admin with ID: {}", adminId);

        Admin admin = adminRepo.findById(adminId)
                .orElseThrow(() -> {
                    log.warn("Deactivation failed: Admin not found with ID: {}", adminId);
                    return new IllegalArgumentException("Admin not found");
                });

        admin.setActive(false);
        adminRepo.save(admin);

        log.info("Admin deactivated successfully: {} (ID: {})", admin.getEmail(), adminId);
    }

    /**
     * Reactivate admin account.
     *
     * @param adminId the admin ID to reactivate
     * @throws IllegalArgumentException if admin not found
     */
    @Transactional
    public void reactivateAdmin(Long adminId) {
        log.info("Reactivating admin with ID: {}", adminId);

        Admin admin = adminRepo.findById(adminId)
                .orElseThrow(() -> {
                    log.warn("Reactivation failed: Admin not found with ID: {}", adminId);
                    return new IllegalArgumentException("Admin not found");
                });

        admin.setActive(true);
        adminRepo.save(admin);

        log.info("Admin reactivated successfully: {} (ID: {})", admin.getEmail(), adminId);
    }

    /**
     * Delete admin permanently.
     *
     * @param adminId the admin ID to delete
     * @throws IllegalArgumentException if admin not found
     */
    @Transactional
    public void deleteAdmin(Long adminId) {
        log.info("Deleting admin with ID: {}", adminId);

        if (!adminRepo.existsById(adminId)) {
            log.warn("Deletion failed: Admin not found with ID: {}", adminId);
            throw new IllegalArgumentException("Admin not found");
        }

        adminRepo.deleteById(adminId);
        log.info("Admin deleted successfully with ID: {}", adminId);
    }

    /**
     * Check if email is already registered.
     *
     * @param email the email to check
     * @return true if email exists
     */
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return adminRepo.existsByEmail(email);
    }

    /**
     * Generate access token for admin.
     * In production, this should use JWT (JSON Web Token).
     *
     * @param admin the admin to generate token for
     * @return the generated token
     */
    private String generateToken(Admin admin) {
        // TODO: Implement proper JWT token generation
        // For now, return a simple token (NOT SECURE - for development only)
        return "mock_token_" + admin.getUserId() + "_" + System.currentTimeMillis();

        // Production implementation should use:
        // - JWT library (io.jsonwebtoken:jjwt)
        // - Sign with secret key
        // - Include claims: userId, email, role, expiration
        // Example:
        // return Jwts.builder()
        //     .setSubject(admin.getEmail())
        //     .claim("userId", admin.getUserId())
        //     .claim("role", admin.getRole())
        //     .setIssuedAt(new Date())
        //     .setExpiration(new Date(System.currentTimeMillis() + expiresIn * 1000))
        //     .signWith(SignatureAlgorithm.HS512, jwtSecret)
        //     .compact();
    }
}
