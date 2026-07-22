package com.finlit.gamification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Data access for unlocked badges. */
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {

    List<UserBadge> findByUserId(UUID userId);

    boolean existsByUserIdAndBadgeId(UUID userId, String badgeId);
}
