package com.finlit.community.dto;

import com.finlit.community.CommunityReply;

/** A reply as the app renders it. */
public record CommunityReplyDto(
        String id,
        String userId,
        String author,
        String handle,
        String avatar,
        String badge,
        String content,
        String createdAt
) {
    public static CommunityReplyDto from(CommunityReply r) {
        return new CommunityReplyDto(
                r.getId().toString(),
                r.getAuthorId() == null ? null : r.getAuthorId().toString(),
                r.getAuthor(),
                r.getHandle(),
                r.getAvatar(),
                r.getBadge(),
                r.getContent(),
                r.getCreatedAt().toString()
        );
    }
}
