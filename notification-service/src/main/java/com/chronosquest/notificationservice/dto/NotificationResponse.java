package com.chronosquest.notificationservice.dto;

import com.chronosquest.notificationservice.model.NotificationStatus;
import com.chronosquest.notificationservice.model.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private Long recipientId;
    private String recipientName;
    private NotificationType notificationType;
    private String message;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;

    public NotificationResponse(
            Long id,
            Long recipientId,
            String recipientName,
            NotificationType notificationType,
            String message,
            NotificationStatus status,
            LocalDateTime createdAt,
            LocalDateTime sentAt
    ) {
        this.id = id;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.notificationType = notificationType;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
        this.sentAt = sentAt;
    }

    public Long getId() {
        return id;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public String getMessage() {
        return message;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }
}
