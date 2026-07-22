package com.finlit.common.exception;

/**
 * Thrown when the request is understood but invalid for a business reason
 * (e.g. logging a negative savings amount). Maps to HTTP 400.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
