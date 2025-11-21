package isj.group4.fingerprintmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for updating staff information (excludes password).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffUpdateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String name;
    private String surname;
    private String email;
    private Long departmentId;
    private Integer noAbsence;
    private Boolean active;
}

