package isj.group4.fingerprintmanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for returning attendance information.
 * Includes staff and department details for convenience.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponseDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Unique identifier for the attendance record.
     */
    private Long attendanceId;

    /**
     * The date of attendance.
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate attendanceDate;

    /**
     * The time the staff member arrived.
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime arrivalTime;

    /**
     * The time the staff member departed (null if not yet recorded).
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime departureTime;

    /**
     * Staff member information.
     */
    private Long staffId;
    private String staffName;
    private String staffSurname;
    private String staffEmail;

    /**
     * Department information (if staff is assigned to a department).
     */
    private Long departmentId;
    private String departmentName;

    /**
     * Status of the attendance record:
     * - "ARRIVAL_RECORDED": Only arrival time is set
     * - "DEPARTURE_RECORDED": Departure time was just recorded
     * - "COMPLETE": Both arrival and departure times are set
     * - "INCOMPLETE": Neither time is set (should not normally occur)
     */
    private String status;
}

