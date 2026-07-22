package com.finlit.community;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/** Data access for post likes. */
public interface PostLikeRepository extends JpaRepository<PostLike, UUID> {

    boolean existsByPostIdAndUserId(UUID postId, UUID userId);

    long countByPostId(UUID postId);

    void deleteByPostIdAndUserId(UUID postId, UUID userId);
}
