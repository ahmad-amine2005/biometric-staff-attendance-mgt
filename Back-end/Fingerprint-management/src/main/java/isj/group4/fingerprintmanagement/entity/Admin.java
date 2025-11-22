package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {
    // No extra attributes in diagram; keep class to represent role
    public Admin(Long userId, String name, String surname, String email) {
        super(userId, name, surname, email, null, null);
    }
}
