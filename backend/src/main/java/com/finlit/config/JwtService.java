package com.finlit.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * Creates and verifies JWTs (JSON Web Tokens).
 *
 * A token is a signed string that proves "this request is from user X" without
 * the server storing any session. We issue two kinds:
 *   - access token  (short-lived, 24h)  — sent on every API call
 *   - refresh token (long-lived, 30d)   — used only to get a fresh access token
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long accessExpirationMs;
    private final long refreshExpirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-expiration-ms}") long accessExpirationMs,
            @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String generateAccessToken(UUID userId) {
        return buildToken(userId, accessExpirationMs, "access");
    }

    public String generateRefreshToken(UUID userId) {
        return buildToken(userId, refreshExpirationMs, "refresh");
    }

    private String buildToken(UUID userId, long ttlMs, String type) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("type", type)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + ttlMs))
                .signWith(key)
                .compact();
    }

    /** Reads the user id out of a valid token. Throws if the token is bad/expired. */
    public UUID extractUserId(String token) {
        return UUID.fromString(parse(token).getSubject());
    }

    public boolean isRefreshToken(String token) {
        return "refresh".equals(parse(token).get("type", String.class));
    }

    /** Verifies the signature + expiry and returns the token's contents. */
    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
