package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;
    private String surname;

    @Column(unique = true, nullable = false)
    private String email;



    /**
     * User role (e.g., "ROLE_ADMIN", "ROLE_STAFF").
     * Used for authorization and access control.
     */
    @Column(nullable = false)
    private String role;

    /**
     * Indicates if the account is active.
     * Inactive accounts cannot authenticate.
     */
    @Builder.Default
    private Boolean active = true;

    // One user may have many notifications
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();

    // Optional one-to-one fingerprint
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Fingerprint fingerprint;
}
