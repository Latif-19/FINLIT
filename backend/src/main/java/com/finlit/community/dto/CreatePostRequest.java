package com.finlit.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Body for POST /community/posts. */
public record CreatePostRequest(
        @NotBlank(message = "category is required")
        String category,

        @NotBlank(message = "content is required")
        @Size(max = 2000, message = "content is too long")
        String content
) {}
