package isj.group4.fingerprintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notifId;

    @Lob
    private String content;
    private LocalDateTime dateSent;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
