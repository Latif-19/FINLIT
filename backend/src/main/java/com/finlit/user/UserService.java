package com.finlit.user;

import com.finlit.auth.dto.UserProfileDto;
import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.user.dto.UpdateProfileRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Business logic for the logged-in user's own profile: reading it, editing it,
 * and activating premium after a successful payment.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(UUID userId) {
        return UserProfileDto.from(requireUser(userId));
    }

    @Transactional
    public UserProfileDto updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = requireUser(userId);

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }
        if (request.avatar() != null) {
            user.setAvatar(request.avatar());
        }
        if (request.age() != null) {
            user.setAge(request.age());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }

        userRepository.save(user);
        return UserProfileDto.from(user);
    }

    /** Marks the user as premium (called after a confirmed payment). */
    @Transactional
    public UserProfileDto activatePremium(UUID userId) {
        User user = requireUser(userId);
        user.setSubscriptionTier("premium");
        userRepository.save(user);
        return UserProfileDto.from(user);
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
