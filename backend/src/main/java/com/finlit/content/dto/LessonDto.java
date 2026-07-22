package com.finlit.content.dto;

import com.finlit.content.Lesson;

import java.util.List;

/**
 * A lesson as the app expects it (frontend LessonModule). Note `xp` is the
 * display string ("100 XP") derived from the numeric `xpVal`.
 */
public record LessonDto(
        long id,
        String title,
        String desc,
        String duration,
        String xp,
        int xpVal,
        List<String> content,
        String emoji
) {
    public static LessonDto from(Lesson l) {
        return new LessonDto(
                l.getId(),
                l.getTitle(),
                l.getDescription(),
                l.getDuration(),
                l.getXpVal() + " XP",
                l.getXpVal(),
                l.getContent(),
                l.getEmoji()
        );
    }
}
