package com.finlit.community.dto;

import java.util.List;

/**
 * A post as the app renders it: author display fields, content, the total like
 * count, whether the CURRENT user liked it, and the reply thread.
 */
public record CommunityPostDto(
        String id,
        String userId,
        String author,
        String handle,
        String avatar,
        String badge,
        String category,
        String content,
        long likes,
        boolean likedByUser,
        String createdAt,
        List<CommunityReplyDto> replies
) {}
