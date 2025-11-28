package isj.group4.fingerprintmanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for recording attendance (arrival or departure).
 * Used when staff clocks in or out.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequestDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * The ID of the staff member recording attendance.
     */
    @NotNull(message = "Staff ID is required")
    private Long staffId;

    /**
     * The date of attendance.
     */
    @NotNull(message = "Attendance date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate attendanceDate;

    /**
     * The time of the attendance record (arrival or departure).
     * This will be used as arrivalTime if no attendance exists for the date,
     * or as departureTime if arrival is already recorded.
     */
    @NotNull(message = "Attendance time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime attendanceTime;
}

