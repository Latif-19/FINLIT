package com.finlit.common.exception;

/**
 * Thrown when a user with the correct password tries to log in but has not yet
 * confirmed their email. Maps to HTTP 403 so the app can tell this apart from a
 * wrong password (401) and route the user to the verification screen.
 */
public class EmailNotVerifiedException extends RuntimeException {
    public EmailNotVerifiedException(String message) {
        super(message);
    }
}
