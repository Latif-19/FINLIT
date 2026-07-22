package com.finlit.tutor.dto;

/** One prior chat turn (frontend TutorMessage). role is "user" or "assistant". */
public record TutorMessageDto(
        String role,
        String content
) {}
