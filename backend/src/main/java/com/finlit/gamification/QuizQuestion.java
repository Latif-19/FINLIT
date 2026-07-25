package com.finlit.gamification;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * A single quiz question belonging to a lesson module, with its ordered answer
 * options. The correct option is stored here (server-side only) so scoring is
 * authoritative and can't be tampered with from the app.
 */
@Entity
@Table(name = "quiz_questions")
@Getter
@Setter
@NoArgsConstructor
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "module_id", nullable = false)
    private Long moduleId;

    /** Position of this question within its module's quiz (0-based). */
    @Column(nullable = false)
    private int questionOrder;

    @Column(nullable = false, length = 1000)
    private String question;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "quiz_options", joinColumns = @JoinColumn(name = "question_id"))
    @OrderColumn(name = "option_order")
    private List<QuizOption> options = new ArrayList<>();
}
