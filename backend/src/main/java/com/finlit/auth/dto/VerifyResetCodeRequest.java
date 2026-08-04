package com.finlit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Body for POST /auth/verify-reset-code — checks a reset code without consuming
 * it, so the app can fail fast on the code screen instead of making the user
 * type a new password first.
 */
public record VerifyResetCodeRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,

        @NotBlank(message = "Reset code is required")
        @Pattern(regexp = "\\d{6}", message = "Enter the 6-digit code")
        String code
) {}
