package com.finlit.progress;

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
import java.util.UUID;

/**
 * One recorded attempt at a module's quiz: which module, what score, and when.
 * A user can attempt a quiz multiple times, so these accumulate — the progress
 * screen shows the score history per module.
 *
 * Written by the gamification quiz-scoring endpoint (built next); read here by
 * the progress dashboard.
 */
@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "module_id", nullable = false)
    private Long moduleId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int totalQuestions;

    @Column(nullable = false)
    private Instant takenAt = Instant.now();
}
