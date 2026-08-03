package com.finlit.progress;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * A record that a specific user finished a specific lesson. The unique
 * constraint on (user_id, lesson_id) means a lesson can only be "completed"
 * once per user — so XP is never awarded twice for the same lesson.
 */
@Entity
@Table(name = "lesson_completions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "lesson_id"}))
@Getter
@Setter
@NoArgsConstructor
public class LessonCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    /** Wall-clock time the user spent in the lesson session, in seconds. */
    @Column(nullable = false, columnDefinition = "integer not null default 0")
    private int timeSpentSeconds;

    @Column(nullable = false)
    private Instant completedAt = Instant.now();
}
