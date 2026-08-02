package com.finlit.auth.dto;

import com.finlit.user.User;

/**
 * The safe, public view of a user sent back to the app. Note it deliberately
 * omits the password hash. Mirrors `UserProfile` in the frontend's types/api.ts.
 */
public record UserProfileDto(
        String id,
        String name,
        String email,
        String avatar,
        String age,
        String phone,
        String subscriptionTier,
        String createdAt,
        String lastAssessedAt
) {
    /** Converts a User entity into this DTO. */
    public static UserProfileDto from(User u) {
        return new UserProfileDto(
                u.getId().toString(),
                u.getName(),
                u.getEmail(),
                u.getAvatar(),
                u.getAge() == null ? "" : u.getAge(),
                u.getPhone() == null ? "" : u.getPhone(),
                u.getSubscriptionTier(),
                u.getCreatedAt().toString(),
                u.getLastAssessedAt() == null ? null : u.getLastAssessedAt().toString()
        );
    }
}
