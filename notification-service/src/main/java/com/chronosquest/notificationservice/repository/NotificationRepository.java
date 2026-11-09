package com.chronosquest.notificationservice.repository;

import com.chronosquest.notificationservice.model.Notification;
import com.chronosquest.notificationservice.model.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientId(Long recipientId);

    List<Notification> findByRecipientIdAndStatus(
            Long recipientId,
            NotificationStatus status
    );

    Optional<Notification> findByIdAndRecipientId(
            Long id,
            Long recipientId
    );

    List<Notification> findByRecipientIdAndStatusNot(
            Long recipientId,
            NotificationStatus status
    );

    List<Notification> findByStatus(NotificationStatus status);
}