package com.finlit.auth;

import com.finlit.auth.dto.AuthResponse;
import com.finlit.auth.dto.LoginRequest;
import com.finlit.auth.dto.RegisterRequest;
import com.finlit.auth.dto.RegisterResponse;
import com.finlit.auth.dto.UserProfileDto;
import com.finlit.auth.dto.VerifyEmailRequest;
import com.finlit.common.exception.BadRequestException;
import com.finlit.common.exception.ConflictException;
import com.finlit.common.exception.EmailNotVerifiedException;
import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.common.exception.UnauthorizedException;
import com.finlit.config.JwtService;
import com.finlit.user.User;
import com.finlit.user.UserRepository;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * All authentication business logic lives here (controllers stay thin).
 * Handles: registration, email verification, login, token refresh, resend.
 *
 * Strict verification: register does NOT issue tokens. The user must confirm the
 * 6-digit code emailed to them (POST /auth/verify-email) before they can log in.
 */
@Service
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final long codeTtlMinutes;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       EmailService emailService,
                       @Value("${app.verification.code-ttl-minutes:15}") long codeTtlMinutes) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.codeTtlMinutes = codeTtlMinutes;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists.");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        // The raw password is hashed with bcrypt and never stored in plain text.
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setEmailVerified(false);
        assignNewCode(user);
        userRepository.save(user);

        emailService.sendVerificationCode(email, user.getName(), user.getVerificationCode());

        return new RegisterResponse(
                email,
                "We sent a 6-digit code to " + email + ". Enter it to verify your account.",
                true
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        // Same generic message whether the email is unknown or the password is
        // wrong — never reveal which, to protect against account probing.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        // Correct credentials but unverified: send a fresh code and tell the app
        // to show the verification screen (403, distinct from a wrong password).
        if (!user.isEmailVerified()) {
            // Only mint a new code if there isn't already a usable one. Otherwise a
            // second login attempt would silently invalidate the code the user is
            // already reading in their inbox.
            boolean needsNewCode = user.getVerificationCode() == null
                    || user.getVerificationCodeExpiresAt() == null
                    || Instant.now().isAfter(user.getVerificationCodeExpiresAt());
            if (needsNewCode) {
                assignNewCode(user);
                userRepository.save(user);
                emailService.sendVerificationCode(email, user.getName(), user.getVerificationCode());
            }
            throw new EmailNotVerifiedException(
                    "Your email isn't verified yet. Enter the code we emailed you, "
                            + "or tap Resend for a new one.");
        }

        return buildAuthResponse(user);
    }

    /** Confirms the emailed code, marks the account verified, and logs the user in. */
    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found for that email."));

        if (user.isEmailVerified()) {
            // Already verified — just log them in so a double-submit is harmless.
            return buildAuthResponse(user);
        }

        if (user.getVerificationCode() == null || user.getVerificationCodeExpiresAt() == null) {
            throw new BadRequestException("No active code. Please request a new one.");
        }
        if (Instant.now().isAfter(user.getVerificationCodeExpiresAt())) {
            throw new BadRequestException("That code has expired. Please request a new one.");
        }
        if (!user.getVerificationCode().equals(request.code().trim())) {
            throw new BadRequestException("Incorrect code. Please check and try again.");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    /** Regenerates and re-sends a verification code (used by the resend button). */
    @Transactional
    public void resendCode(String rawEmail) {
        String email = rawEmail.trim().toLowerCase();

        // Don't reveal whether the account exists; only send if it does and is
        // still unverified. Either way the caller gets the same generic success.
        userRepository.findByEmail(email).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                assignNewCode(user);
                userRepository.save(user);
                emailService.sendVerificationCode(email, user.getName(), user.getVerificationCode());
            }
        });
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

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /** Generates a fresh 6-digit code with a TTL and stores it on the user. */
    private void assignNewCode(User user) {
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        user.setVerificationCode(code);
        user.setVerificationCodeExpiresAt(Instant.now().plus(codeTtlMinutes, ChronoUnit.MINUTES));
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getId());
        return new AuthResponse(UserProfileDto.from(user), accessToken, refreshToken);
    }
}
