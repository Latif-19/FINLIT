package com.finlit.gamification;

import java.util.List;

/**
 * The fixed catalog of badges a user can earn. These definitions never change
 * at runtime, so they live in code (ported from the frontend) rather than the
 * database. Whether a given user has *unlocked* each one is tracked separately
 * in the user_badges table.
 */
public final class BadgeCatalog {

    public record BadgeDefinition(String id, String name, String description, String emoji) {}

    public static final List<BadgeDefinition> ALL = List.of(
            new BadgeDefinition("first-lesson", "First Steps", "Complete your first lesson", "🎯"),
            new BadgeDefinition("three-lessons", "Getting Smart", "Complete 3 lessons", "📚"),
            new BadgeDefinition("all-lessons", "Financial Guru", "Complete all 6 lessons", "🏆"),
            new BadgeDefinition("quiz-perfect", "Perfect Score", "Get 100% on any quiz", "💯"),
            new BadgeDefinition("streak-3", "On Fire", "Maintain a 3-day streak", "🔥"),
            new BadgeDefinition("streak-7", "Unstoppable", "Maintain a 7-day streak", "⚡"),
            new BadgeDefinition("first-savings", "Saver", "Log your first savings", "💰"),
            new BadgeDefinition("savings-goal", "Goal Crusher", "Reach your savings goal", "🎯"),
            new BadgeDefinition("simulator-user", "Explorer", "Use a financial simulator", "🧮"),
            new BadgeDefinition("ai-tutor", "Curious Mind", "Ask the AI Tutor a question", "🤖")
    );

    private BadgeCatalog() {}
}
