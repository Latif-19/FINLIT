package com.finlit.auth;

import com.finlit.auth.dto.AuthResponse;
import com.finlit.auth.dto.ForgotPasswordRequest;
import com.finlit.auth.dto.LoginRequest;
import com.finlit.auth.dto.RefreshRequest;
import com.finlit.auth.dto.RegisterRequest;
import com.finlit.auth.dto.RegisterResponse;
import com.finlit.auth.dto.ResendCodeRequest;
import com.finlit.auth.dto.ResetPasswordRequest;
import com.finlit.auth.dto.VerifyEmailRequest;
import com.finlit.auth.dto.VerifyResetCodeRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Auth endpoints (all public). Because of the /api context path these live at:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/refresh
 *   POST /api/auth/forgot-password
 *
 * The controller only wires HTTP to the service — @Valid triggers request
 * validation, and any thrown exception is formatted by GlobalExceptionHandler.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/verify-email")
    public AuthResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return authService.verifyEmail(request);
    }

    @PostMapping("/resend-code")
    public Map<String, String> resendCode(@Valid @RequestBody ResendCodeRequest request) {
        authService.resendCode(request.email());
        return Map.of("message",
                "If an unverified account exists for that email, a new code has been sent.");
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request.refreshToken());
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return Map.of("message",
                "If an account exists for that email, a reset code has been sent.");
    }

    @PostMapping("/verify-reset-code")
    public Map<String, String> verifyResetCode(@Valid @RequestBody VerifyResetCodeRequest request) {
        authService.verifyResetCode(request.email(), request.code());
        return Map.of("message", "Code accepted. You can now set a new password.");
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.email(), request.code(), request.newPassword());
        return Map.of("message", "Your password has been reset. Please sign in.");
    }
}
