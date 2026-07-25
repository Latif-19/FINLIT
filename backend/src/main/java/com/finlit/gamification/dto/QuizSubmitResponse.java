package com.finlit.gamification.dto;

import java.util.List;

/**
 * Result of a quiz submission (frontend QuizSubmitResponse): how many were
 * correct, out of how many, and the correct option index for each question (so
 * the app can highlight the right answers after submitting).
 */
public record QuizSubmitResponse(
        int score,
        int totalQuestions,
        List<Integer> correctAnswers
) {}
