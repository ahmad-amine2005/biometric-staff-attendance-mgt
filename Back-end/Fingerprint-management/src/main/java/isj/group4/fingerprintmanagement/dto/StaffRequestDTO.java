package isj.group4.fingerprintmanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import isj.group4.fingerprintmanagement.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for creating or updating staff members.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffRequestDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Surname is required")
    private String surname;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    /** Number of absences (default: 0) */
    @Builder.Default
    private Integer noAbsence = 0;

    /** Staff role (default: ROLE_STAFF) */
    @Builder.Default
    private User.Role role = User.Role.STAFF;

    /** Account active status (default: true) */
    @Builder.Default
    private Boolean active = true;

    @NotNull(message = "Number of days per week in contract is required")
    private Integer noDaysPerWeek_contract;

    @NotNull(message = "Contract start time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime_contract;

    @NotNull(message = "Contract end time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime_contract;
}