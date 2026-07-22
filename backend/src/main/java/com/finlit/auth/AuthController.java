package com.finlit.auth;

import com.finlit.auth.dto.AuthResponse;
import com.finlit.auth.dto.ForgotPasswordRequest;
import com.finlit.auth.dto.LoginRequest;
import com.finlit.auth.dto.RefreshRequest;
import com.finlit.auth.dto.RegisterRequest;
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
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
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
                "If an account exists for that email, a reset link has been sent.");
    }
}
