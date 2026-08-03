package com.finlit.progress;

import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.content.Lesson;
import com.finlit.content.LessonRepository;
import com.finlit.gamification.BadgeService;
import com.finlit.gamification.dto.UserBadgeDto;
import com.finlit.progress.dto.AssessmentResult;
import com.finlit.progress.dto.ProgressResponse;
import com.finlit.progress.dto.SyllabusModule;
import com.finlit.user.User;
import com.finlit.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Business logic for tracking a user's learning progress: the dashboard
 * aggregate, marking lessons complete (with XP + streak), logging savings, and
 * scoring the onboarding assessment.
 */
@Service
public class ProgressService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final BadgeService badgeService;

    public ProgressService(UserRepository userRepository,
                            LessonRepository lessonRepository,
                            LessonCompletionRepository lessonCompletionRepository,
                            QuizAttemptRepository quizAttemptRepository,
                            BadgeService badgeService) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.badgeService = badgeService;
    }

    // ─── Dashboard ──────────────────────────────────────────────────────────
    // Not read-only: reading progress also re-evaluates badges, which may
    // persist newly-unlocked ones.
    @Transactional
    public ProgressResponse getProgress(UUID userId) {
        User user = requireUser(userId);

        long completed = lessonCompletionRepository.countByUserId(userId);
        long total = lessonRepository.count();

        // Which specific lessons are done — lets the frontend unlock lessons by
        // ID rather than assuming completion always happens in a fixed order
        // (needed once the Learn tab can reorder lessons by goal). Also gives
        // us total time spent learning for free from the same query.
        List<LessonCompletion> completions = lessonCompletionRepository.findByUserId(userId);
        List<Long> completedLessonIds = completions.stream()
                .map(LessonCompletion::getLessonId)
                .toList();
        int totalTimeSpentSeconds = completions.stream()
                .mapToInt(LessonCompletion::getTimeSpentSeconds)
                .sum();

        // Group quiz attempts into a per-module list of scores, in order.
        Map<Long, List<Integer>> quizScores = new LinkedHashMap<>();
        quizAttemptRepository.findByUserIdOrderByTakenAtAsc(userId).forEach(attempt ->
                quizScores.computeIfAbsent(attempt.getModuleId(), k -> new ArrayList<>())
                        .add(attempt.getScore()));

        // Current badge state (evaluates + persists any newly-earned badges).
        List<UserBadgeDto> badges = badgeService.getBadges(userId);

        return new ProgressResponse(
                completed, total, user.getXp(), user.getStreak(),
                user.getScore(), user.getGoal() == null ? "" : user.getGoal(),
                badges, quizScores, user.getSavings(), user.getTargetGoal(),
                completedLessonIds, totalTimeSpentSeconds);
    }

    // ─── Complete a lesson ──────────────────────────────────────────────────
    @Transactional
    public ProgressResponse completeLesson(UUID userId, Long lessonId, Integer timeSpentSeconds) {
        User user = requireUser(userId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson " + lessonId + " was not found."));

        // Only award XP the first time a lesson is completed.
        if (!lessonCompletionRepository.existsByUserIdAndLessonId(userId, lessonId)) {
            LessonCompletion completion = new LessonCompletion();
            completion.setUserId(userId);
            completion.setLessonId(lessonId);
            completion.setTimeSpentSeconds(timeSpentSeconds != null && timeSpentSeconds > 0 ? timeSpentSeconds : 0);
            lessonCompletionRepository.save(completion);

            user.setXp(user.getXp() + lesson.getXpVal());
            updateStreak(user);
            userRepository.save(user);
        }

        return getProgress(userId);
    }

    // ─── Log savings toward a goal ──────────────────────────────────────────
    @Transactional
    public ProgressResponse logSavings(UUID userId, double amount) {
        User user = requireUser(userId);
        user.setSavings(user.getSavings() + amount);
        userRepository.save(user);
        return getProgress(userId);
    }

    // ─── Submit the assessment ──────────────────────────────────────────────
    @Transactional
    public AssessmentResult submitAssessment(UUID userId, List<Integer> answers, String goal) {
        User user = requireUser(userId);

        int score = answers.stream().mapToInt(Integer::intValue).sum();
        String tier = tierFor(score);

        user.setScore(score);
        user.setGoal(goal);
        user.setLastAssessedAt(Instant.now());
        userRepository.save(user);

        return new AssessmentResult(score, tier, goal, buildSyllabus());
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    /** Consecutive-day streak: +1 if yesterday, unchanged if today, reset to 1 otherwise. */
    private void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate last = user.getLastActivityDate();

        if (last == null || last.isBefore(today.minusDays(1))) {
            user.setStreak(1);
        } else if (last.equals(today.minusDays(1))) {
            user.setStreak(user.getStreak() + 1);
        }
        // last == today → already counted today, leave streak as-is.
        user.setLastActivityDate(today);
    }

    private String tierFor(int score) {
        if (score >= 13) return "Wealth Builder Pro";
        if (score >= 9) return "Smart Money Manager";
        return "Financial Novice";
    }

    /** Builds the learning path from the lesson catalog, in order. */
    private List<SyllabusModule> buildSyllabus() {
        List<Lesson> lessons = lessonRepository.findAllByOrderByIdAsc();
        List<SyllabusModule> syllabus = new ArrayList<>();
        int order = 1;
        for (Lesson lesson : lessons) {
            syllabus.add(new SyllabusModule(lesson.getId(), lesson.getTitle(), order++));
        }
        return syllabus;
    }
}
