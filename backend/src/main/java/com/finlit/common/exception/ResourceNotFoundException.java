package com.finlit.common.exception;

/**
 * Thrown when something the caller asked for does not exist
 * (e.g. a lesson id, a post, a notification). Maps to HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
