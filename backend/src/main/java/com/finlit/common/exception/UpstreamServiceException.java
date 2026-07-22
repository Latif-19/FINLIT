package com.finlit.common.exception;

/**
 * Thrown when a third-party service we depend on (e.g. Google Gemini) fails or
 * can't be reached. Maps to HTTP 502.
 */
public class UpstreamServiceException extends RuntimeException {
    public UpstreamServiceException(String message) {
        super(message);
    }
}
