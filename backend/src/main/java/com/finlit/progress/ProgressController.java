package com.finlit.progress;

import com.finlit.progress.dto.AssessmentResult;
import com.finlit.progress.dto.AssessmentSubmitRequest;
import com.finlit.progress.dto.CompleteLessonRequest;
import com.finlit.progress.dto.LogSavingsRequest;
import com.finlit.progress.dto.ProgressResponse;
import com.finlit.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Progress endpoints (require a token). The current user is injected via
 * @AuthenticationPrincipal — resolved from the JWT by JwtAuthFilter — so a user
 * can only ever read or change their own progress.
 *
 *   GET  /api/progress
 *   POST /api/progress/lesson
 *   POST /api/progress/savings
 *   POST /api/progress/assessment
 */
@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public ProgressResponse getProgress(@AuthenticationPrincipal User user) {
        return progressService.getProgress(user.getId());
    }

    @PostMapping("/lesson")
    public ProgressResponse completeLesson(@AuthenticationPrincipal User user,
                                           @Valid @RequestBody CompleteLessonRequest request) {
        return progressService.completeLesson(user.getId(), request.lessonId(), request.timeSpentSeconds());
    }

    @PostMapping("/savings")
    public ProgressResponse logSavings(@AuthenticationPrincipal User user,
                                       @Valid @RequestBody LogSavingsRequest request) {
        return progressService.logSavings(user.getId(), request.amount());
    }

    @PostMapping("/assessment")
    public AssessmentResult submitAssessment(@AuthenticationPrincipal User user,
                                             @Valid @RequestBody AssessmentSubmitRequest request) {
        return progressService.submitAssessment(user.getId(), request.answers(), request.goal());
    }
}
