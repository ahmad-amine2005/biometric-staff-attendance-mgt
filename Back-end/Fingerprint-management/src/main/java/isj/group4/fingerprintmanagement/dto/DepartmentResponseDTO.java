package isj.group4.fingerprintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for department response data.
 * Includes statistics about staff and reports.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponseDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long dpmtId;
    private String dpmtName;

    // Statistics
    private Integer totalStaff;
    private Integer activeStaff;
    private Integer totalReports;
}

