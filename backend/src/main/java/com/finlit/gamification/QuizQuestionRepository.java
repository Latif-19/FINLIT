package com.finlit.gamification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Data access for quiz questions. */
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, UUID> {

    /** All questions for a module, in their intended order. */
    List<QuizQuestion> findByModuleIdOrderByQuestionOrderAsc(Long moduleId);

    long countByModuleId(Long moduleId);
}
