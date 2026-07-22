package com.finlit.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Data access for news articles. */
public interface NewsRepository extends JpaRepository<NewsArticle, Long> {

    /** Newest articles first. */
    List<NewsArticle> findAllByOrderByPublishedAtDesc();
}
