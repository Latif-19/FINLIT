package com.finlit.community;

import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.community.dto.CommunityPostDto;
import com.finlit.community.dto.CommunityReplyDto;
import com.finlit.community.dto.CreatePostRequest;
import com.finlit.community.dto.CreateReplyRequest;
import com.finlit.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Business logic for the community forum: listing posts (with the current
 * user's like state), creating posts, toggling likes, and adding replies.
 *
 * When a user posts, their display fields (name → handle, avatar, and a badge
 * derived from their assessment score) are snapshotted onto the post/reply.
 */
@Service
public class CommunityService {

    private final CommunityPostRepository postRepository;
    private final CommunityReplyRepository replyRepository;
    private final PostLikeRepository postLikeRepository;

    public CommunityService(CommunityPostRepository postRepository,
                            CommunityReplyRepository replyRepository,
                            PostLikeRepository postLikeRepository) {
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
        this.postLikeRepository = postLikeRepository;
    }

    @Transactional(readOnly = true)
    public List<CommunityPostDto> getPosts(UUID currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> toDto(post, currentUserId))
                .toList();
    }

    @Transactional
    public CommunityPostDto createPost(User user, CreatePostRequest request) {
        CommunityPost post = new CommunityPost();
        post.setAuthorId(user.getId());
        post.setAuthor(user.getName());
        post.setHandle(handleFor(user.getName()));
        post.setAvatar(user.getAvatar());
        post.setBadge(badgeFor(user.getScore()));
        post.setCategory(request.category());
        post.setContent(request.content());
        postRepository.save(post);
        return toDto(post, user.getId());
    }

    @Transactional
    public CommunityPostDto toggleLike(UUID userId, UUID postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found."));

        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            postLikeRepository.deleteByPostIdAndUserId(postId, userId);
        } else {
            PostLike like = new PostLike();
            like.setPostId(postId);
            like.setUserId(userId);
            postLikeRepository.save(like);
        }
        return toDto(post, userId);
    }

    @Transactional
    public CommunityPostDto addReply(User user, UUID postId, CreateReplyRequest request) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found."));

        CommunityReply reply = new CommunityReply();
        reply.setPostId(post.getId());
        reply.setAuthorId(user.getId());
        reply.setAuthor(user.getName());
        reply.setHandle(handleFor(user.getName()));
        reply.setAvatar(user.getAvatar());
        reply.setBadge(badgeFor(user.getScore()));
        reply.setContent(request.content());
        replyRepository.save(reply);

        return toDto(post, user.getId());
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private CommunityPostDto toDto(CommunityPost post, UUID currentUserId) {
        long likes = post.getSeedLikes() + postLikeRepository.countByPostId(post.getId());
        boolean likedByUser = postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);

        List<CommunityReplyDto> replies = replyRepository
                .findByPostIdOrderByCreatedAtAsc(post.getId())
                .stream()
                .map(CommunityReplyDto::from)
                .toList();

        return new CommunityPostDto(
                post.getId().toString(),
                post.getAuthorId() == null ? null : post.getAuthorId().toString(),
                post.getAuthor(),
                post.getHandle(),
                post.getAvatar(),
                post.getBadge(),
                post.getCategory(),
                post.getContent(),
                likes,
                likedByUser,
                post.getCreatedAt().toString(),
                replies
        );
    }

    /** Turns a display name into an @handle, e.g. "Ama Mensah" → "@ama_mensah". */
    private String handleFor(String name) {
        return "@" + name.trim().toLowerCase().replaceAll("\\s+", "_");
    }

    /** Community badge derived from the user's assessment score. */
    private String badgeFor(int score) {
        if (score >= 13) return "Wealth Builder Pro";
        if (score >= 8) return "Smart Manager";
        return "Novice Explorer";
    }
}
