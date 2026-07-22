package com.finlit.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Body for POST /community/posts/{id}/replies. */
public record CreateReplyRequest(
        @NotBlank(message = "content is required")
        @Size(max = 2000, message = "content is too long")
        String content
) {}
