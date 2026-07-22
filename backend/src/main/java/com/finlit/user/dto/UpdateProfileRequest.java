package com.finlit.user.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Body for PUT /profile. Name is required; avatar/age/phone are optional and
 * only updated when provided.
 */
public record UpdateProfileRequest(
        @NotBlank(message = "Name is required")
        String name,

        String avatar,

        String age,

        String phone
) {}
