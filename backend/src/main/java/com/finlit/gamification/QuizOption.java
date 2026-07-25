package com.finlit.gamification;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
