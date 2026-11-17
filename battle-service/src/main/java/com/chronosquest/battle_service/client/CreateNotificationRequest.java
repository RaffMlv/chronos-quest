package com.chronosquest.battle_service.client;

public class CreateNotificationRequest {

    private Long recipientId;
    private String recipientName;
    private String notificationType;
    private String message;

    public CreateNotificationRequest(
            Long recipientId,
            String recipientName,
            String notificationType,
            String message
    ) {
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.notificationType = notificationType;
        this.message = message;
    }

    public Long getRecipientId() { return recipientId; }
    public String getRecipientName() { return recipientName; }
    public String getNotificationType() { return notificationType; }
    public String getMessage() { return message; }
}