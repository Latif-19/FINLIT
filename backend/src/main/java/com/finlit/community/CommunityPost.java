package com.finlit.community;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * A forum post. The author's display fields (name, handle, avatar, badge) are
 * snapshotted onto the post at creation time, so a post reads consistently even
 * if the user later changes their profile. `authorId` links to the real user
 * (null for seeded demo posts).
 *
 * `seedLikes` is a base like-count for seeded posts; real likes are counted from
 * the post_likes table and added on top.
 */
@Entity
@Table(name = "community_posts")
@Getter
@Setter
@NoArgsConstructor
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "author_id")
    private UUID authorId;

    @Column(nullable = false)
    private String author;

    private String handle;

    private String avatar;

    private String badge;

    private String category;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    private int seedLikes = 0;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
