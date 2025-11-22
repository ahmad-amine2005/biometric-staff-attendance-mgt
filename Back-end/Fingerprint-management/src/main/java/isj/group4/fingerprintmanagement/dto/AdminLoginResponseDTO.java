package isj.group4.fingerprintmanagement.dto;

import isj.group4.fingerprintmanagement.entity.Admin;
import isj.group4.fingerprintmanagement.entity.User;
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

    private Admin admin;

}


