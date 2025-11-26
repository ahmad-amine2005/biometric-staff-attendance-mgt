package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    private LocalDateTime arrivalTime;
    private LocalDate attendanceDate;
    private LocalDateTime departureTime;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;
}
