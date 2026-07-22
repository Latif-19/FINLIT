package com.finlit.content;

import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.content.dto.LessonDto;
import com.finlit.content.dto.LessonListResponse;
import com.finlit.content.dto.NewsDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for delivering learning content and news. Read-only: the app
 * consumes this content; creating/editing it is an admin concern for later.
 */
@Service
public class ContentService {

    private final LessonRepository lessonRepository;
    private final NewsRepository newsRepository;

    public ContentService(LessonRepository lessonRepository, NewsRepository newsRepository) {
        this.lessonRepository = lessonRepository;
        this.newsRepository = newsRepository;
    }

    @Transactional(readOnly = true)
    public LessonListResponse getModules() {
        List<LessonDto> modules = lessonRepository.findAllByOrderByIdAsc()
                .stream()
                .map(LessonDto::from)
                .toList();
        return new LessonListResponse(modules);
    }

    @Transactional(readOnly = true)
    public LessonDto getModule(long id) {
        return lessonRepository.findById(id)
                .map(LessonDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson " + id + " was not found."));
    }

    @Transactional(readOnly = true)
    public List<NewsDto> getNews() {
        return newsRepository.findAllByOrderByPublishedAtDesc()
                .stream()
                .map(NewsDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public NewsDto getNewsArticle(long id) {
        return newsRepository.findById(id)
                .map(NewsDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Article " + id + " was not found."));
    }
}
