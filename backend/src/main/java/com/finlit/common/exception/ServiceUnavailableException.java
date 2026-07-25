package com.finlit.common.exception;

/**
 * Thrown when a feature is temporarily unavailable due to configuration
 * (e.g. the AI Tutor has no API key set). Maps to HTTP 503.
 */
public class ServiceUnavailableException extends RuntimeException {
    public ServiceUnavailableException(String message) {
        super(message);
    }
}
