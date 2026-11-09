package com.chronosquest.notificationservice.controller;

import com.chronosquest.notificationservice.dto.CreateNotificationRequest;
import com.chronosquest.notificationservice.dto.NotificationResponse;
import com.chronosquest.notificationservice.model.NotificationStatus;
import com.chronosquest.notificationservice.service.NotificationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Criar notificação
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody CreateNotificationRequest request) {

        NotificationResponse response =
                notificationService.createNotification(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Listar notificações do usuário
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Boolean read) {

        Long recipientId = Long.parseLong(jwt.getSubject());

        List<NotificationResponse> notifications =
                notificationService.getNotifications(recipientId, read);

        return ResponseEntity.ok(notifications);
    }

    // Marcar uma notificação como lida
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        Long recipientId = Long.parseLong(jwt.getSubject());

        NotificationResponse response =
                notificationService.markAsRead(id, recipientId);

        return ResponseEntity.ok(response);
    }

    // Marcar todas as notificações como lidas
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal Jwt jwt) {

        Long recipientId = Long.parseLong(jwt.getSubject());

        notificationService.markAllAsRead(recipientId);

        return ResponseEntity.noContent().build();
    }

    // Excluir notificação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        Long recipientId = Long.parseLong(jwt.getSubject());

        notificationService.deleteNotification(id, recipientId);

        return ResponseEntity.noContent().build();
    }
}