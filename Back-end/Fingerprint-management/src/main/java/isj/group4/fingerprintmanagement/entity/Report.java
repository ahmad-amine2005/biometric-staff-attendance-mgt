package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @Lob
    private String content;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
