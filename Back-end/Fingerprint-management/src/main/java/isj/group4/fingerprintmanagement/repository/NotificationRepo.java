package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification,Long> {
    Notification findByNotifId(Long notifId);

    List<Notification> findNotificationsByDateSent(LocalDateTime dateSent);
}
