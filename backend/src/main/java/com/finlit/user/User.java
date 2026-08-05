package com.finlit.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * The User entity — the heart of the app.
 *
 * This one Java class becomes the "users" table in PostgreSQL automatically:
 * each field below turns into a column. Everything else (progress, XP, badges,
 * posts) will link back to a user by their id.
 *
 * The fields mirror the frontend's `UserProfile` in types/api.ts, plus the
 * gamification/progress values the app tracks per user.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    /** Unique id, generated automatically. Serializes to a string for the app. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    /** Login identifier — no two users can share an email. */
    @Column(nullable = false, unique = true)
    private String email;

    /** The bcrypt-hashed password. The raw password is never stored. */
    @Column(nullable = false)
    private String passwordHash;

    // ─── Email verification ─────────────────────────────────────────────────
    /** False until the user confirms the 6-digit code emailed at sign-up. */
    @Column(nullable = false, columnDefinition = "boolean not null default false")
    private boolean emailVerified = false;

    /** The current 6-digit verification code (null once verified). */
    private String verificationCode;

    /** When the current verification code stops being valid. */
    private Instant verificationCodeExpiresAt;

    // ─── Password reset ─────────────────────────────────────────────────────
    /**
     * The current 6-digit password-reset code (null when no reset is pending).
     * Kept separate from verificationCode so a reset can't clobber a sign-up
     * verification that's still in flight.
     */
    private String resetCode;

    /** When the current reset code stops being valid. */
    private Instant resetCodeExpiresAt;

    /** Emoji avatar shown across the app. Defaults to the FinLit owl.
     *  May also hold a base64 data URI (data:image/jpeg;base64,...) for a
     *  real uploaded photo — hence TEXT, not varchar(255). */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String avatar = "🦉"; // 🦉

    private String age;

    private String phone;

    /** "free" or "premium" — drives the paywall. */
    @Column(nullable = false)
    private String subscriptionTier = "free";

    // ─── Assessment & personalisation ───────────────────────────────────────
    /** The user's chosen financial goal from onboarding. */
    private String goal;

    /** Latest assessment score (0–15). */
    @Column(nullable = false)
    private int score = 0;

    private Instant lastAssessedAt;

    // ─── Gamification & progress ────────────────────────────────────────────
    @Column(nullable = false)
    private int xp = 0;

    @Column(nullable = false)
    private int streak = 0;

    /** The last calendar day the user completed a lesson — drives the streak. */
    private LocalDate lastActivityDate;

    /** Amount saved so far toward the user's goal (GH₵). */
    @Column(nullable = false)
    private double savings = 0;

    /** The savings target the user set (GH₵). */
    @Column(nullable = false)
    private double targetGoal = 0;

    /** True once the user has asked the AI Tutor at least one question. */
    @Column(nullable = false, columnDefinition = "boolean not null default false")
    private boolean tutorUsed = false;

    // ─── Timestamps ─────────────────────────────────────────────────────────
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
