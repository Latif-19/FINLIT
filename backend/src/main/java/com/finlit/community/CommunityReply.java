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

/** A reply to a post, with the author's display fields snapshotted like the post. */
@Entity
@Table(name = "community_replies")
@Getter
@Setter
@NoArgsConstructor
public class CommunityReply {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    @Column(name = "author_id")
    private UUID authorId;

    @Column(nullable = false)
    private String author;

    private String handle;

    private String avatar;

    private String badge;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
