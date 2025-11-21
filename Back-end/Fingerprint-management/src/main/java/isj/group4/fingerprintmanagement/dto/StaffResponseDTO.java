package isj.group4.fingerprintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for staff response data.
 * Excludes sensitive information like password.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffResponseDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long userId;
    private String name;
    private String surname;
    private String email;
    private String fullName;
    private Integer noAbsence;
    private String role;
    private Boolean active;

    // Department information
    private Long departmentId;
    private String departmentName;

    // Contract information (if exists)
    private Long contractId;
    private String contractStatus;

    // Statistics
    private Integer totalAttendances;
}

