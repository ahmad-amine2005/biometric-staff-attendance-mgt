package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contractId;

    private Integer noDaysPerWeek;
    private LocalDate startTime;
    private LocalDate endTime;
    private LocalDate contractDate;

    @OneToOne
    @JoinColumn(name = "staff_id", unique = true)
    private Staff staff;
}
