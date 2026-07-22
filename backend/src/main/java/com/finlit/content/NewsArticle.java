package com.finlit.content;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A curated financial-news article. Holds every field the news screen renders:
 * the headline, its trusted source + link, category, publish time, read time,
 * cover image, a short summary, and the full body split into paragraphs.
 */
@Entity
@Table(name = "news_articles")
@Getter
@Setter
@NoArgsConstructor
public class NewsArticle {

    @Id
    private Long id;

    @Column(nullable = false)
    private String title;

    private String source;

    private String sourceUrl;

    private String category;

    private Instant publishedAt;

    private String readTime;

    private String imageUrl;

    @Column(length = 1000)
    private String summary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "news_paragraphs", joinColumns = @JoinColumn(name = "news_id"))
    @OrderColumn(name = "para_order")
    @Column(name = "paragraph", length = 4000)
    private List<String> paragraphs = new ArrayList<>();
}
