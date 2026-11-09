package com.chronosquest.notificationservice.service;

import com.chronosquest.notificationservice.dto.CreateNotificationRequest;
import com.chronosquest.notificationservice.dto.NotificationResponse;
import com.chronosquest.notificationservice.model.Notification;
import com.chronosquest.notificationservice.model.NotificationStatus;
import com.chronosquest.notificationservice.repository.NotificationRepository;
import com.chronosquest.notificationservice.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationSender notificationSender;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationSender notificationSender) {
        this.notificationRepository = notificationRepository;
        this.notificationSender = notificationSender;
    }

    // Criar notificação
    @Transactional
    public NotificationResponse createNotification(CreateNotificationRequest request) {

        Notification notification = new Notification();

        notification.setRecipientId(request.getRecipientId());
        notification.setRecipientName(request.getRecipientName());
        notification.setNotificationType(request.getNotificationType());
        notification.setMessage(request.getMessage());
        notification.setStatus(NotificationStatus.PENDING);

        Notification savedNotification = notificationRepository.save(notification);

        return toResponse(savedNotification);
    }

    // Listar notificações do destinatário
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(
            Long recipientId,
            Boolean read) {

        List<Notification> notifications;

        if (read == null) {
            notifications = notificationRepository.findByRecipientId(recipientId);

        } else if (read) {
            notifications = notificationRepository.findByRecipientIdAndStatus(
                    recipientId,
                    NotificationStatus.READ
            );

        } else {
            notifications = notificationRepository.findByRecipientIdAndStatusNot(
                    recipientId,
                    NotificationStatus.READ
            );
        }

        return notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Marcar uma notificação como lida
    @Transactional
    public NotificationResponse markAsRead(Long id, Long recipientId) {

        Notification notification = notificationRepository
                .findByIdAndRecipientId(id, recipientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notificação não encontrada ou não pertence ao destinatário."
                ));

        notification.setStatus(NotificationStatus.READ);

        return toResponse(notificationRepository.save(notification));
    }

    // Marcar todas as notificações como lidas
    @Transactional
    public void markAllAsRead(Long recipientId) {

        List<Notification> notifications = notificationRepository
                .findByRecipientIdAndStatusNot(recipientId, NotificationStatus.READ);

        notifications.forEach(notification ->
                notification.setStatus(NotificationStatus.READ)
        );

        notificationRepository.saveAll(notifications);
    }

    // Excluir notificação
    @Transactional
    public void deleteNotification(Long id, Long recipientId) {

        Notification notification = notificationRepository
                .findByIdAndRecipientId(id, recipientId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada."));

        notificationRepository.delete(notification);
    }

    @Transactional
    public int processPendingNotifications() {

        List<Notification> pendingNotifications =
                notificationRepository.findByStatus(NotificationStatus.PENDING);

        for (Notification notification : pendingNotifications) {

            notificationSender.send(notification);

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        }

        notificationRepository.saveAll(pendingNotifications);

        return pendingNotifications.size();
    }

    // Converter entidade para DTO
    private NotificationResponse toResponse(Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getRecipientId(),
                notification.getRecipientName(),
                notification.getNotificationType(),
                notification.getMessage(),
                notification.getStatus(),
                notification.getCreatedAt(),
                notification.getSentAt()
        );
    }
}
