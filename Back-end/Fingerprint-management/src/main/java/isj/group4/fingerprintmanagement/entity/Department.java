package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dpmtId;

    private String dpmtName;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Staff> staff = new ArrayList<>();

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Report> reports = new ArrayList<>();
}
