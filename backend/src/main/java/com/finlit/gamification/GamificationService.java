package com.finlit.gamification;

import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.gamification.dto.LeaderboardEntryDto;
import com.finlit.gamification.dto.LeaderboardResponse;
import com.finlit.gamification.dto.QuizAnswerDto;
import com.finlit.gamification.dto.QuizSubmitResponse;
import com.finlit.progress.QuizAttempt;
import com.finlit.progress.QuizAttemptRepository;
import com.finlit.user.User;
import com.finlit.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;


@Service
public class GamificationService {

    private final UserRepository userRepository;
    private final LeaderboardCompetitorRepository competitorRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final BadgeService badgeService;

    public GamificationService(UserRepository userRepository,
                               LeaderboardCompetitorRepository competitorRepository,
                               QuizQuestionRepository quizQuestionRepository,
                               QuizAttemptRepository quizAttemptRepository,
                               BadgeService badgeService) {
        this.userRepository = userRepository;
        this.competitorRepository = competitorRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.badgeService = badgeService;
    }

    /** A working row before ranks are assigned. */
    private record Row(String userId, String name, String avatar, int xp) {}

    @Transactional(readOnly = true)
    public LeaderboardResponse getLeaderboard(UUID currentUserId) {
        List<Row> rows = new ArrayList<>();

        // Seeded competitors + all real users compete on the same board.
        competitorRepository.findAll().forEach(c ->
                rows.add(new Row(c.getId(), c.getName(), c.getAvatar(), c.getXp())));
        userRepository.findAll().forEach(u ->
                rows.add(new Row(u.getId().toString(), u.getName(), u.getAvatar(), u.getXp())));

        // Highest XP first; ties broken alphabetically for a stable order.
        rows.sort(Comparator.comparingInt(Row::xp).reversed()
                .thenComparing(Row::name, Comparator.nullsLast(String::compareTo)));

        String currentId = currentUserId.toString();
        List<LeaderboardEntryDto> entries = new ArrayList<>();
        int currentUserRank = 0;
        for (int i = 0; i < rows.size(); i++) {
            Row row = rows.get(i);
            int rank = i + 1;
            entries.add(new LeaderboardEntryDto(row.userId(), row.name(), row.avatar(), row.xp(), rank));
            if (row.userId().equals(currentId)) {
                currentUserRank = rank;
            }
        }

        return new LeaderboardResponse(entries, currentUserRank);
    }

    @Transactional
    public QuizSubmitResponse submitQuiz(UUID userId, Long moduleId, List<QuizAnswerDto> answers) {
        List<QuizQuestion> questions = quizQuestionRepository.findByModuleIdOrderByQuestionOrderAsc(moduleId);
        if (questions.isEmpty()) {
            throw new ResourceNotFoundException("No quiz found for module " + moduleId + ".");
        }
        int total = questions.size();

        // The correct option index for each question, in order.
        List<Integer> correctAnswers = new ArrayList<>();
        for (QuizQuestion q : questions) {
            int correctIdx = -1;
            for (int i = 0; i < q.getOptions().size(); i++) {
                if (q.getOptions().get(i).isCorrect()) {
                    correctIdx = i;
                    break;
                }
            }
            correctAnswers.add(correctIdx);
        }

        // Score the submitted answers against the correct indices.
        int score = 0;
        for (QuizAnswerDto answer : answers) {
            int qi = answer.questionIndex();
            if (qi >= 0 && qi < total && answer.selectedOptionIndex().equals(correctAnswers.get(qi))) {
                score++;
            }
        }

        // Record the attempt (feeds the progress dashboard's quizScores).
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUserId(userId);
        attempt.setModuleId(moduleId);
        attempt.setScore(score);
        attempt.setTotalQuestions(total);
        quizAttemptRepository.save(attempt);

        // Award XP for correct answers, then re-check badges (e.g. Perfect Score).
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        user.setXp(user.getXp() + score * 10);
        userRepository.save(user);
        badgeService.evaluate(userId);

        return new QuizSubmitResponse(score, total, correctAnswers);
    }
}
