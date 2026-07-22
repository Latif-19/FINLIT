package com.finlit.gamification.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** Body for POST /gamification/quiz-score (frontend QuizSubmitRequest). */
public record QuizSubmitRequest(
        @NotNull(message = "moduleId is required")
        Long moduleId,

        @NotEmpty(message = "answers are required")
        @Valid
        List<QuizAnswerDto> answers
) {}
