package com.finlit.tutor.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;


public record TutorChatRequest(
        @NotBlank(message = "message is required")
        String message,

        List<TutorMessageDto> history
) {}
