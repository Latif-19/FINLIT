package com.finlit.community;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Data access for forum posts. */
public interface CommunityPostRepository extends JpaRepository<CommunityPost, UUID> {

    List<CommunityPost> findAllByOrderByCreatedAtDesc();
}
