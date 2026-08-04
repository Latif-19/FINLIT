package com.finlit.progress.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Body for POST /progress/assessment.
 *
 * `answers` is the list of selected option scores, one per question (each 1–3);
 * the backend sums them into the total assessment score. The per-element bounds
 * are enforced rather than assumed: the sum is stored on the user and picks
 * their tier, so an unbounded value let a client name its own result, and a
 * null element threw an NPE (a 500) inside the sum.
 */
public record AssessmentSubmitRequest(
        @NotEmpty(message = "answers are required")
        @Size(max = 20, message = "too many answers")
        List<
                @NotNull(message = "each answer is required")
                @Min(value = 1, message = "each answer must be between 1 and 3")
                @Max(value = 3, message = "each answer must be between 1 and 3")
                Integer> answers,

        @NotBlank(message = "goal is required")
        String goal
) {}
