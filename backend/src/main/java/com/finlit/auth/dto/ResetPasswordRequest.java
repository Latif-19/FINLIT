package com.finlit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Body for POST /auth/reset-password — the code is re-checked here rather than
 * trusted from the earlier verify step, so a client can't skip straight to
 * setting a new password.
 */
public record ResetPasswordRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,

        @NotBlank(message = "Reset code is required")
        @Pattern(regexp = "\\d{6}", message = "Enter the 6-digit code")
        String code,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String newPassword
) {}
