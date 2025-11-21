package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Admin extends User {
    // Admin-specific attributes can be added here
    // Currently inherits all fields from User (userId, name, surname, email, password, role, active)

    /**
     * Hashed password for authentication.
     * Should be encoded using BCryptPasswordEncoder before storing.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Constructor for creating admin with full details.
     */
    public Admin(Long userId, String name, String surname, String email, String role, Boolean active) {
        super(userId, name, surname, email, role, active, null, null);
    }

    /**
     * Simplified constructor for new admin creation.
     */
    public Admin(String name, String surname, String email) {
        super(null, name, surname, email, "ROLE_ADMIN", true, null, null);
    }
}
