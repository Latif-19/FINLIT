package com.finlit.common.exception;

/**
 * Thrown when a request clashes with existing state
 * (e.g. registering an email that is already taken). Maps to HTTP 409.
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
