package com.finlit.gamification.dto;

/**
 * A badge as shown to a user, including whether/when they unlocked it
 * (unlockedAt is null while still locked). Mirrors the frontend's UserBadge.
 *
 * Defined now because the progress dashboard returns a list of these; the
 * gamification feature (next) will populate them with real data.
 */
public record UserBadgeDto(
        String id,
        String name,
        String description,
        String emoji,
        String unlockedAt
) {}
