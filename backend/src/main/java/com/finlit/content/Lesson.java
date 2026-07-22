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

import java.util.ArrayList;
import java.util.List;

/**
 * A learning module (lesson). These are editorial content with fixed ids
 * (1–6) that the app references directly, so the id is assigned manually rather
 * than auto-generated. Mirrors the frontend's LessonModule.
 */
@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
public class Lesson {

    @Id
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    private String duration;

    /** XP awarded for completing the lesson (e.g. 100). */
    private int xpVal;

    private String emoji;

    /**
     * The lesson body — one string per "slide". Stored in a companion table
     * (lesson_content) with the slide order preserved.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "lesson_content", joinColumns = @JoinColumn(name = "lesson_id"))
    @OrderColumn(name = "slide_order")
    @Column(name = "paragraph", length = 2000)
    private List<String> content = new ArrayList<>();
}
