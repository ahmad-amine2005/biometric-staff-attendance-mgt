package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fingerprints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fingerprint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fingerId;

    @Column(nullable = false)
    private String fingerCode;

    @OneToOne
    @JoinColumn(name = "staff_id", unique = true)
    private Staff staff;
}
