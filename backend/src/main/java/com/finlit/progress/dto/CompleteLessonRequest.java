package com.finlit.progress.dto;

import jakarta.validation.constraints.NotNull;

/** Body for POST /progress/lesson. */
public record CompleteLessonRequest(
        @NotNull(message = "lessonId is required")
        Long lessonId,

        // Optional — how long the user spent in the lesson session, in seconds.
        Integer timeSpentSeconds
) {}
