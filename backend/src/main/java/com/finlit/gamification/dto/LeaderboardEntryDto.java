package com.finlit.gamification.dto;

/** One ranked row on the leaderboard (frontend LeaderboardEntry). */
public record LeaderboardEntryDto(
        String userId,
        String name,
        String avatar,
        int xp,
        int rank
) {}
