package com.finlit.user;

import com.finlit.auth.dto.UserProfileDto;
import com.finlit.user.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The logged-in user's own profile (require a token):
 *   GET  /api/profile          → current profile
 *   PUT  /api/profile          → update name/avatar/age/phone
 *   POST /api/profile/premium  → activate premium after payment
 */
@RestController
@RequestMapping("/profile")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserProfileDto getProfile(@AuthenticationPrincipal User user) {
        return userService.getProfile(user.getId());
    }

    @PutMapping
    public UserProfileDto updateProfile(@AuthenticationPrincipal User user,
                                        @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(user.getId(), request);
    }

    @PostMapping("/premium")
    public UserProfileDto activatePremium(@AuthenticationPrincipal User user) {
        return userService.activatePremium(user.getId());
    }
}
