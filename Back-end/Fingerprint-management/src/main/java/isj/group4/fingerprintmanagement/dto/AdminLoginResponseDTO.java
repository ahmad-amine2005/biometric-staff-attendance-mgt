package isj.group4.fingerprintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO returned after successful admin authentication.
 * Includes token metadata and admin profile information.
 * Aligns with User/Admin entity structure.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginResponseDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /** Admin user ID from database */
    private Long userId;

    /** Admin email (used as principal identifier) */
    private String email;

    /** Admin first name */
    private String name;

    /** Admin surname/last name */
    private String surname;

    /** Full display name (computed) */
    private String fullName;

    /** JWT access token for API authentication */
    private String accessToken;

    /** Token type (default: Bearer) */
    @Builder.Default
    private String tokenType = "Bearer";

    /** Token expiration time in seconds from now */
    private Long expiresIn;

    /** Timestamp when the token was issued */
    private LocalDateTime issuedAt;

    /** Timestamp when the token expires */
    private LocalDateTime expiresAt;

    /** Admin role/authority (e.g., "ROLE_ADMIN", "ROLE_SUPER_ADMIN") */
    private String role;

    /** Success message */
    @Builder.Default
    private String message = "Login successful";
}


