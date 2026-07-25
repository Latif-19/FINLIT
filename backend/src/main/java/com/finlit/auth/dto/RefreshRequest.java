package com.finlit.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Body for POST /auth/refresh — swaps a valid refresh token for a new access token. */
public record RefreshRequest(
        @NotBlank(message = "Refresh token is required")
        String refreshToken
) {}
