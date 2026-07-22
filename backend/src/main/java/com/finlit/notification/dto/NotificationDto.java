package com.finlit.notification.dto;

import com.finlit.notification.Notification;

/** A notification as the app expects it (frontend AppNotification). */
public record NotificationDto(
        String id,
        String type,
        String title,
        String body,
        boolean read,
        String createdAt
) {
    public static NotificationDto from(Notification n) {
        return new NotificationDto(
                n.getId().toString(),
                n.getType(),
                n.getTitle(),
                n.getBody(),
                n.isRead(),
                n.getCreatedAt().toString()
        );
    }
}
