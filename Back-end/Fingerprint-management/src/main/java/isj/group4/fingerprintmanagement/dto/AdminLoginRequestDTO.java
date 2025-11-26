package isj.group4.fingerprintmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for admin login requests.
 * Uses email as the login identifier to align with User entity structure.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginRequestDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Admin email address (serves as username/login identifier).
     * Must match the email field in the User/Admin entity.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    /**
     * Admin password for authentication.
     * Should be hashed in the database using BCrypt or similar.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    /**
     * If true, the server may issue a longer-lived token.
     * Typical: 15 minutes (false) vs 7 days (true).
     */
    @Builder.Default
    private boolean rememberMe = false;
}