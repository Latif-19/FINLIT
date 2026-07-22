package com.finlit.auth;

import com.finlit.auth.dto.AuthResponse;
import com.finlit.auth.dto.LoginRequest;
import com.finlit.auth.dto.RegisterRequest;
import com.finlit.auth.dto.UserProfileDto;
import com.finlit.common.exception.ConflictException;
import com.finlit.common.exception.UnauthorizedException;
import com.finlit.config.JwtService;
import com.finlit.user.User;
import com.finlit.user.UserRepository;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * All authentication business logic lives here (controllers stay thin).
 * Handles: registration, login, token refresh, and password-reset requests.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists.");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        // The raw password is hashed with bcrypt and never stored in plain text.
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        // Same generic message whether the email is unknown or the password is
        // wrong — never reveal which, to protect against account probing.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(String refreshToken) {
        try {
            if (!jwtService.isRefreshToken(refreshToken)) {
                throw new UnauthorizedException("That token cannot be used to refresh.");
            }
            UUID userId = jwtService.extractUserId(refreshToken);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UnauthorizedException("This account no longer exists."));
            return buildAuthResponse(user);
        } catch (JwtException | IllegalArgumentException ex) {
            throw new UnauthorizedException("Invalid or expired refresh token.");
        }
    }

    /**
     * Password-reset request. Full email delivery will be added later; for now
     * this succeeds silently and never reveals whether the email is registered.
     */
    public void forgotPassword(String email) {
        // Intentionally a no-op stub for now (prevents account enumeration).
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getId());
        return new AuthResponse(UserProfileDto.from(user), accessToken, refreshToken);
    }
}
