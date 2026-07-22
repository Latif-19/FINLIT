package com.finlit.progress.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/**
 * Body for POST /progress/assessment.
 *
 * `answers` is the list of selected option scores, one per question (each 1–3);
 * the backend sums them into the total assessment score.
 */
public record AssessmentSubmitRequest(
        @NotEmpty(message = "answers are required")
        List<Integer> answers,

        @NotBlank(message = "goal is required")
        String goal
) {}
