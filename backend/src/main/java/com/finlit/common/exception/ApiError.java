package com.finlit.common.exception;

import java.time.Instant;
import java.util.Map;

/**
 * The standard shape of every error the API returns.
 *
 * Instead of a raw stack trace, the app always receives a tidy JSON object like:
 * { "status": 409, "error": "Conflict", "message": "Email already exists",
 *   "path": "/api/auth/register", "timestamp": "...", "fieldErrors": null }
 */
public record ApiError(
        int status,
        String error,
        String message,
        String path,
        Instant timestamp,
        Map<String, String> fieldErrors
) {
    /** Convenience constructor for the common case with no per-field errors. */
    public ApiError(int status, String error, String message, String path) {
        this(status, error, message, path, Instant.now(), null);
    }
}
