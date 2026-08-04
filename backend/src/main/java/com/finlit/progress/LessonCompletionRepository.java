package com.finlit.progress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Data access for lesson completions. */
public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, UUID> {

    boolean existsByUserIdAndLessonId(UUID userId, Long lessonId);

    long countByUserId(UUID userId);

    List<LessonCompletion> findByUserId(UUID userId);
}
