package isj.group4.fingerprintmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * DTO for detailed department information with staff list.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDetailDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long dpmtId;
    private String dpmtName;

    // Statistics
    private Integer totalStaff;
    private Integer activeStaff;
    private Integer totalReports;

    // Staff summary list
    private List<StaffSummaryDTO> staffList;

    /**
     * Nested DTO for staff summary information.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StaffSummaryDTO implements Serializable {
        private Long userId;
        private String fullName;
        private String email;
        private Boolean active;
        private Integer noAbsence;
    }
}