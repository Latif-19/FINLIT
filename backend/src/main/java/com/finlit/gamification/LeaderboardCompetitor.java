package com.finlit.gamification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A seeded "competitor" on the leaderboard so the board looks populated even
 * with few real users. At query time these are merged with real users and
 * ranked together by XP.
 */
@Entity
@Table(name = "leaderboard_competitors")
@Getter
@Setter
@NoArgsConstructor
public class LeaderboardCompetitor {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String avatar;

    @Column(nullable = false)
    private int xp;
}
