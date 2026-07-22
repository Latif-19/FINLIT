package com.finlit.progress.dto;

/** One entry in a personalised learning path (frontend SyllabusModule). */
public record SyllabusModule(
        long moduleId,
        String title,
        int order
) {}
