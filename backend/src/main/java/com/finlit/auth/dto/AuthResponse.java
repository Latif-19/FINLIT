package com.finlit.auth.dto;

/**
 * Returned by register / login / refresh. Matches `AuthResponse` in the
 * frontend: the user profile plus the two tokens the app stores.
 */
public record AuthResponse(
        UserProfileDto user,
        String token,
        String refreshToken
) {}
