package com.finlit.progress.dto;

import jakarta.validation.constraints.NotNull;

/** Body for POST /progress/lesson. */
public record CompleteLessonRequest(
        @NotNull(message = "lessonId is required")
        Long lessonId
) {}
