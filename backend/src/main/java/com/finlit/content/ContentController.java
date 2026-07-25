package com.finlit.content;

import com.finlit.content.dto.LessonDto;
import com.finlit.content.dto.LessonListResponse;
import com.finlit.content.dto.NewsDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Content endpoints (require a valid token). Paths (with the /api prefix):
 *   GET /api/lessons        → all learning modules
 *   GET /api/lessons/{id}   → one module
 *   GET /api/news           → all news articles (newest first)
 *   GET /api/news/{id}      → one article
 */
@RestController
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/lessons")
    public LessonListResponse getLessons() {
        return contentService.getModules();
    }

    @GetMapping("/lessons/{id}")
    public LessonDto getLesson(@PathVariable long id) {
        return contentService.getModule(id);
    }

    @GetMapping("/news")
    public List<NewsDto> getNews() {
        return contentService.getNews();
    }

    @GetMapping("/news/{id}")
    public NewsDto getNewsArticle(@PathVariable long id) {
        return contentService.getNewsArticle(id);
    }
}
