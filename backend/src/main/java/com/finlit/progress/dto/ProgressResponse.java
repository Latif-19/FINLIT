package com.finlit.progress.dto;

import com.finlit.gamification.dto.UserBadgeDto;

import java.util.List;
import java.util.Map;

/**
 * The user's whole dashboard in one object (frontend ProgressResponse):
 * lessons finished, XP, streak, badges, quiz score history, and savings.
 */
public record ProgressResponse(
        long lessonsCompleted,
        long totalLessons,
        int xp,
        int streak,
        int score,
        String goal,
        List<UserBadgeDto> badges,
        Map<Long, List<Integer>> quizScores,
        double savings,
        double targetGoal
) {}
