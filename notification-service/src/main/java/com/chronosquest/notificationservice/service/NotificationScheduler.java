package com.chronosquest.notificationservice.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {

    private final NotificationService notificationService;

    public NotificationScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Scheduled(fixedDelay = 10000)
    public void processPendingNotifications() {

        int processed = notificationService.processPendingNotifications();

        if (processed > 0) {
            System.out.println(
                    "Notificações processadas: " + processed
            );
        }
    }
}
