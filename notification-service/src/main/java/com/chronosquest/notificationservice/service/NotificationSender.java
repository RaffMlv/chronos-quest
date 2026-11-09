package com.chronosquest.notificationservice.service;

import com.chronosquest.notificationservice.model.Notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class NotificationSender {

    private static final Logger logger =
            LoggerFactory.getLogger(NotificationSender.class);

    public void send(Notification notification) {

        logger.info(
                "Notificação enviada (simulação) | ID: {} | Destinatário: {} | Tipo: {} | Mensagem: {}",
                notification.getId(),
                notification.getRecipientName(),
                notification.getNotificationType(),
                notification.getMessage()
        );
    }
}