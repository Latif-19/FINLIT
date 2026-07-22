package com.finlit.content.dto;

import com.finlit.content.NewsArticle;

import java.util.List;

/**
 * A news article as the app renders it. `content` is the list of body
 * paragraphs; `publishedAt` is an ISO timestamp the app can format for display.
 */
public record NewsDto(
        long id,
        String title,
        String source,
        String sourceUrl,
        String category,
        String publishedAt,
        String readTime,
        String imageUrl,
        String summary,
        List<String> content
) {
    public static NewsDto from(NewsArticle a) {
        return new NewsDto(
                a.getId(),
                a.getTitle(),
                a.getSource(),
                a.getSourceUrl(),
                a.getCategory(),
                a.getPublishedAt() == null ? null : a.getPublishedAt().toString(),
                a.getReadTime(),
                a.getImageUrl(),
                a.getSummary(),
                a.getParagraphs()
        );
    }
}
