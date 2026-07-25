package com.finlit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Body for POST /auth/register. The @annotations validate the input BEFORE it
 * reaches our code — if they fail, the GlobalExceptionHandler returns a 400 with
 * the exact field messages.
 */
public record RegisterRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password
) {}
