package com.finlit.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Data access for notifications. */
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /** Looked up by id AND user so one user can never touch another's notification. */
    Optional<Notification> findByIdAndUserId(UUID id, UUID userId);

    long countByUserId(UUID userId);
}
