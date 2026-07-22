package com.finlit.gamification;

import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.content.LessonRepository;
import com.finlit.gamification.dto.UserBadgeDto;
import com.finlit.progress.LessonCompletionRepository;
import com.finlit.progress.QuizAttempt;
import com.finlit.progress.QuizAttemptRepository;
import com.finlit.simulation.SimulationRepository;
import com.finlit.user.User;
import com.finlit.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Owns badges: evaluates which ones a user has earned from their current stats,
 * persists newly-unlocked ones, and returns the full catalog with unlock state.
 *
 * Used by the gamification "badges" endpoint and by the progress dashboard.
 */
@Service
public class BadgeService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final SimulationRepository simulationRepository;

    public BadgeService(UserRepository userRepository,
                        LessonRepository lessonRepository,
                        LessonCompletionRepository lessonCompletionRepository,
                        QuizAttemptRepository quizAttemptRepository,
                        UserBadgeRepository userBadgeRepository,
                        SimulationRepository simulationRepository) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.simulationRepository = simulationRepository;
    }

    /** Returns every badge with its unlock timestamp (null while still locked). */
    @Transactional
    public List<UserBadgeDto> getBadges(UUID userId) {
        evaluate(userId);

        Map<String, Instant> unlocked = new HashMap<>();
        userBadgeRepository.findByUserId(userId)
                .forEach(b -> unlocked.put(b.getBadgeId(), b.getUnlockedAt()));

        return BadgeCatalog.ALL.stream()
                .map(def -> new UserBadgeDto(
                        def.id(), def.name(), def.description(), def.emoji(),
                        unlocked.containsKey(def.id()) ? unlocked.get(def.id()).toString() : null))
                .toList();
    }

    /**
     * Checks every rule against the user's current stats and awards any badge
     * that is now satisfied but not yet recorded. Safe to call repeatedly.
     */
    @Transactional
    public void evaluate(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        long lessons = lessonCompletionRepository.countByUserId(userId);
        long totalLessons = lessonRepository.count();

        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByTakenAtAsc(userId);
        boolean quizPerfect = attempts.stream()
                .anyMatch(a -> a.getTotalQuestions() > 0 && a.getScore() == a.getTotalQuestions());

        award(userId, "first-lesson", lessons >= 1);
        award(userId, "three-lessons", lessons >= 3);
        award(userId, "all-lessons", totalLessons > 0 && lessons >= totalLessons);
        award(userId, "quiz-perfect", quizPerfect);
        award(userId, "streak-3", user.getStreak() >= 3);
        award(userId, "streak-7", user.getStreak() >= 7);
        award(userId, "first-savings", user.getSavings() > 0);
        award(userId, "savings-goal", user.getTargetGoal() > 0 && user.getSavings() >= user.getTargetGoal());
        award(userId, "simulator-user", simulationRepository.existsByUserId(userId));
        award(userId, "ai-tutor", user.isTutorUsed());
    }

    private void award(UUID userId, String badgeId, boolean condition) {
        if (condition && !userBadgeRepository.existsByUserIdAndBadgeId(userId, badgeId)) {
            UserBadge badge = new UserBadge();
            badge.setUserId(userId);
            badge.setBadgeId(badgeId);
            badge.setUnlockedAt(Instant.now());
            userBadgeRepository.save(badge);
        }
    }
}
