package com.finlit.gamification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


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
