package com.finlit.notification;

import com.finlit.notification.dto.NotificationDto;
import com.finlit.user.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Notification endpoints (require a token):
 *   GET  /api/notifications
 *   POST /api/notifications/{id}/read
 */
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationDto> getNotifications(@AuthenticationPrincipal User user) {
        return notificationService.getNotifications(user.getId());
    }

    @PostMapping("/{id}/read")
    public NotificationDto markAsRead(@AuthenticationPrincipal User user,
                                      @PathVariable String id) {
        return notificationService.markAsRead(user.getId(), id);
    }
}
