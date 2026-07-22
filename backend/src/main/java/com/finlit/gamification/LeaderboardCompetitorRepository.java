package com.finlit.gamification;

import org.springframework.data.jpa.repository.JpaRepository;

/** Data access for seeded leaderboard competitors. */
public interface LeaderboardCompetitorRepository extends JpaRepository<LeaderboardCompetitor, String> {
}
