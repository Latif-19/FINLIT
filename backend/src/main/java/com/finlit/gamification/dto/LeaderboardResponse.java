package com.finlit.gamification.dto;

import java.util.List;

/** GET /gamification/leaderboard — ranked entries plus the caller's own rank. */
public record LeaderboardResponse(
        List<LeaderboardEntryDto> entries,
        int currentUserRank
) {}
