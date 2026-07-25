package com.finlit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Body for POST /auth/resend-code: re-sends a fresh verification code. */
public record ResendCodeRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email
) {}
