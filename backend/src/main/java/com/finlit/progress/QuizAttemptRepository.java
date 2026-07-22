package com.finlit.progress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Data access for quiz attempts. */
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {

    /** All of a user's attempts, oldest first, so score history reads in order. */
    List<QuizAttempt> findByUserIdOrderByTakenAtAsc(UUID userId);
}
