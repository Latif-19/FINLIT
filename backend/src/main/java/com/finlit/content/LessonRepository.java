package com.finlit.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Data access for lessons. */
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    /** Lessons in their intended learning order (1, 2, 3 …). */
    List<Lesson> findAllByOrderByIdAsc();
}
