package com.finlit.tutor;

import com.finlit.tutor.dto.TutorChatRequest;
import com.finlit.tutor.dto.TutorChatResponse;
import com.finlit.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/tutor")
public class TutorController {

    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    @PostMapping("/chat")
    public TutorChatResponse chat(@AuthenticationPrincipal User user,
                                  @Valid @RequestBody TutorChatRequest request) {
        return tutorService.chat(user.getId(), request.message(), request.history());
    }
}
