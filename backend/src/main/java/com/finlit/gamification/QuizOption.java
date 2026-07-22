package com.finlit.gamification;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One answer choice for a quiz question. Embedded inside QuizQuestion (stored in
 * the quiz_options table). `correct` marks the right answer — never sent to the
 * client until after they submit.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizOption {

    @Column(name = "option_text", length = 500)
    private String text;

    @Column(name = "is_correct")
    private boolean correct;
}
