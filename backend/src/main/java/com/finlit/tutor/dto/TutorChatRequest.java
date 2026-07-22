package com.finlit.tutor.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

/**
 * Body for POST /tutor/chat (frontend TutorChatRequest): the new message plus
 * the prior conversation so the tutor has context.
 */
public record TutorChatRequest(
        @NotBlank(message = "message is required")
        String message,

        List<TutorMessageDto> history
) {}
