package com.chronosquest.notificationservice.dto;

import com.chronosquest.notificationservice.model.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CreateNotificationRequest {

    @NotNull
    @Positive
    private Long recipientId;

    @NotBlank
    @Size(max = 80)
    private String recipientName;

    @NotNull
    private NotificationType notificationType;

    @NotBlank
    private String message;

    public CreateNotificationRequest() {
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
