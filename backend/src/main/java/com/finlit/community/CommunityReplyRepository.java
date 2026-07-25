package com.finlit.community;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Data access for post replies. */
public interface CommunityReplyRepository extends JpaRepository<CommunityReply, UUID> {

    /** A post's replies, oldest first (conversation order). */
    List<CommunityReply> findByPostIdOrderByCreatedAtAsc(UUID postId);
}
