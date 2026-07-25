package com.finlit.community;

import com.finlit.community.dto.CommunityPostDto;
import com.finlit.community.dto.CreatePostRequest;
import com.finlit.community.dto.CreateReplyRequest;
import com.finlit.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Community forum endpoints (require a token):
 *   GET  /api/community/posts
 *   POST /api/community/posts
 *   POST /api/community/posts/{postId}/like
 *   POST /api/community/posts/{postId}/replies
 */
@RestController
@RequestMapping("/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/posts")
    public List<CommunityPostDto> getPosts(@AuthenticationPrincipal User user) {
        return communityService.getPosts(user.getId());
    }

    @PostMapping("/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public CommunityPostDto createPost(@AuthenticationPrincipal User user,
                                       @Valid @RequestBody CreatePostRequest request) {
        return communityService.createPost(user, request);
    }

    @PostMapping("/posts/{postId}/like")
    public CommunityPostDto toggleLike(@AuthenticationPrincipal User user,
                                       @PathVariable UUID postId) {
        return communityService.toggleLike(user.getId(), postId);
    }

    @PostMapping("/posts/{postId}/replies")
    public CommunityPostDto addReply(@AuthenticationPrincipal User user,
                                     @PathVariable UUID postId,
                                     @Valid @RequestBody CreateReplyRequest request) {
        return communityService.addReply(user, postId, request);
    }
}
