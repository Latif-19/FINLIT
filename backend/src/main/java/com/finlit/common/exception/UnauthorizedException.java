package com.finlit.common.exception;

/**
 * Thrown when credentials or a token are missing/invalid
 * (e.g. wrong password, expired refresh token). Maps to HTTP 401.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
