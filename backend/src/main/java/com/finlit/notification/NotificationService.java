package com.finlit.notification;

import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.notification.dto.NotificationDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/**
 * Business logic for in-app notifications: listing a user's notifications and
 * marking them read. New users get a few starter notifications on first fetch
 * so the screen isn't empty. (Event-driven notifications — e.g. on badge
 * unlock — can be added later.)
 */
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public List<NotificationDto> getNotifications(UUID userId) {
        if (notificationRepository.countByUserId(userId) == 0) {
            seedStarterNotifications(userId);
        }
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDto::from)
                .toList();
    }

    @Transactional
    public NotificationDto markAsRead(UUID userId, String notificationId) {
        UUID id = parseId(notificationId);

        Notification notification = notificationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        notification.setRead(true);
        notificationRepository.save(notification);
        return NotificationDto.from(notification);
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private UUID parseId(String notificationId) {
        try {
            return UUID.fromString(notificationId);
        } catch (IllegalArgumentException ex) {
            throw new ResourceNotFoundException("Notification not found.");
        }
    }

    private void seedStarterNotifications(UUID userId) {
        Instant now = Instant.now();
        notificationRepository.saveAll(List.of(
                notification(userId, "lesson_reminder", "Continue Learning!",
                        "You haven't completed Module 3 yet. Keep going!",
                        false, now.minus(1, ChronoUnit.HOURS)),
                notification(userId, "streak_reminder", "Don't break your streak!",
                        "Log in today to maintain your learning streak.",
                        true, now.minus(1, ChronoUnit.DAYS)),
                notification(userId, "badge_earned", "Badge Unlocked!",
                        "You earned the 'First Steps' badge for completing your first lesson.",
                        true, now.minus(2, ChronoUnit.DAYS))
        ));
    }

    private Notification notification(UUID userId, String type, String title, String body,
                                      boolean read, Instant createdAt) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setBody(body);
        n.setRead(read);
        n.setCreatedAt(createdAt);
        return n;
    }
}
