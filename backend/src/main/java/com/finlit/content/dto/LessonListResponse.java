package com.finlit.content.dto;

import java.util.List;

/** Wrapper for GET /lessons — matches the frontend's LessonListResponse. */
public record LessonListResponse(List<LessonDto> modules) {}
