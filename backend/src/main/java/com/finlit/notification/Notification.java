package com.finlit.notification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * A single in-app notification belonging to one user. `type` is one of
 * lesson_reminder / streak_reminder / badge_earned / leaderboard_milestone,
 * which the app uses to pick the icon and colour. Mirrors AppNotification.
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String body;

    @Column(nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
