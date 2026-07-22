package com.finlit.progress.dto;

import java.util.List;

/**
 * Returned after submitting the assessment (frontend AssessmentResult): the
 * computed score, the tier it maps to, the chosen goal, and the generated
 * learning path.
 */
public record AssessmentResult(
        int score,
        String tier,
        String goal,
        List<SyllabusModule> syllabus
) {}
