package com.finlit.gamification;

import com.finlit.gamification.dto.LeaderboardResponse;
import com.finlit.gamification.dto.QuizSubmitRequest;
import com.finlit.gamification.dto.QuizSubmitResponse;
import com.finlit.gamification.dto.UserBadgeDto;
import com.finlit.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/gamification")
public class GamificationController {

    private final GamificationService gamificationService;
    private final BadgeService badgeService;

    public GamificationController(GamificationService gamificationService, BadgeService badgeService) {
        this.gamificationService = gamificationService;
        this.badgeService = badgeService;
    }

    @GetMapping("/leaderboard")
    public LeaderboardResponse getLeaderboard(@AuthenticationPrincipal User user) {
        return gamificationService.getLeaderboard(user.getId());
    }

    @GetMapping("/badges")
    public List<UserBadgeDto> getBadges(@AuthenticationPrincipal User user) {
        return badgeService.getBadges(user.getId());
    }

    @PostMapping("/quiz-score")
    public QuizSubmitResponse submitQuiz(@AuthenticationPrincipal User user,
                                         @Valid @RequestBody QuizSubmitRequest request) {
        return gamificationService.submitQuiz(user.getId(), request.moduleId(), request.answers());
    }
}
