package com.finlit.auth.dto;

/**
 * Returned by POST /auth/register under strict verification: no tokens are
 * issued yet. The app takes {@code email} to the verification screen, where the
 * emailed code is exchanged for real tokens via POST /auth/verify-email.
 */
public record RegisterResponse(
        String email,
        String message,
        boolean requiresVerification
) {}
