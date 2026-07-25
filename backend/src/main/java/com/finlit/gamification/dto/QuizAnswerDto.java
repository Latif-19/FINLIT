package com.finlit.gamification.dto;

import jakarta.validation.constraints.NotNull;

/** One answer in a quiz submission: which question, and which option was picked. */
public record QuizAnswerDto(
        @NotNull(message = "questionIndex is required")
        Integer questionIndex,

        @NotNull(message = "selectedOptionIndex is required")
        Integer selectedOptionIndex
) {}
