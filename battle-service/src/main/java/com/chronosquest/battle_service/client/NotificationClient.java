package com.chronosquest.battle_service.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class NotificationClient {

    private final RestClient restClient;

    public NotificationClient(
            @Value("${chronos.notification-service.url}") String baseUrl
    ) {
        this.restClient = RestClient.create(baseUrl);
    }

    public void createNotification(
            CreateNotificationRequest request,
            String bearerToken
    ) {
        restClient.post()
                .uri("/notifications")
                .header("Authorization", "Bearer " + bearerToken)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }
}