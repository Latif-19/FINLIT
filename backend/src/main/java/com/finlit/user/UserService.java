package com.finlit.user;

import com.finlit.auth.dto.UserProfileDto;
import com.finlit.common.exception.BadRequestException;
import com.finlit.common.exception.ConflictException;
import com.finlit.common.exception.ResourceNotFoundException;
import com.finlit.common.exception.ServiceUnavailableException;
import com.finlit.common.exception.UpstreamServiceException;
import com.finlit.user.dto.UpdateProfileRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Business logic for the logged-in user's own profile: reading it, editing it,
 * and activating premium after a successful payment.
 */
@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    /**
     * Floor below the cheapest plan (GH₵19.99 ≈ 1999 pesewas) with a small
     * buffer for client-side floating point rounding when Paystack's amount is
     * computed as `amount * 100`. Blocks the trivial "pay 1 pesewa, replay the
     * reference" abuse without being strict enough to reject a real payment.
     */
    private static final long MIN_PREMIUM_AMOUNT_PESEWAS = 1000;

    private final UserRepository userRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final RestClient restClient = RestClient.create();
    private final String paystackSecretKey;

    public UserService(UserRepository userRepository,
                       PaymentTransactionRepository paymentTransactionRepository,
                       @Value("${app.paystack.secret-key:}") String paystackSecretKey) {
        this.userRepository = userRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.paystackSecretKey = paystackSecretKey;
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
        if (request.goal() != null && !request.goal().isBlank()) {
            user.setGoal(request.goal());
        }

        userRepository.save(user);
        return UserProfileDto.from(user);
    }

    /**
     * Marks the user as premium — but only after independently verifying the
     * given Paystack transaction reference server-side. Without this, any
     * authenticated caller could hit this endpoint directly and get premium
     * for free, since the client can't be trusted to self-report success.
     */
    @Transactional
    public UserProfileDto activatePremium(UUID userId, String reference) {
        User user = requireUser(userId);

        if (paystackSecretKey == null || paystackSecretKey.isBlank()) {
            throw new ServiceUnavailableException(
                    "Payments are not configured. Set a PAYSTACK_SECRET_KEY to enable premium activation.");
        }

        // A reference can only ever be consumed once — otherwise the same
        // successful payment could be replayed to grant premium repeatedly,
        // including to other accounts.
        if (paymentTransactionRepository.existsByReference(reference)) {
            throw new ConflictException("This payment reference has already been used.");
        }

        Map<?, ?> response;
        try {
            response = restClient.get()
                    .uri("https://api.paystack.co/transaction/verify/{reference}", reference)
                    .header("Authorization", "Bearer " + paystackSecretKey)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientResponseException httpEx) {
            log.error("Paystack verify error {}: {}", httpEx.getStatusCode(), snippet(httpEx.getResponseBodyAsString()));
            throw new UpstreamServiceException("Could not verify the payment with Paystack.");
        } catch (Exception ex) {
            log.error("Paystack verify call failed", ex);
            throw new UpstreamServiceException("Could not reach Paystack to verify the payment.");
        }

        Object dataObj = response != null ? response.get("data") : null;
        if (!(dataObj instanceof Map<?, ?> data)) {
            throw new BadRequestException("Payment verification returned no data.");
        }

        if (!"success".equals(data.get("status"))) {
            throw new BadRequestException("Payment was not successful.");
        }

        if (!"GHS".equals(data.get("currency"))) {
            throw new BadRequestException("Unexpected payment currency.");
        }

        long amount = data.get("amount") instanceof Number n ? n.longValue() : 0;
        if (amount < MIN_PREMIUM_AMOUNT_PESEWAS) {
            throw new BadRequestException("Payment amount is too low for a premium subscription.");
        }

        PaymentTransaction txn = new PaymentTransaction();
        txn.setUserId(userId);
        txn.setReference(reference);
        txn.setAmount(amount);
        paymentTransactionRepository.save(txn);

        user.setSubscriptionTier("premium");
        userRepository.save(user);
        return UserProfileDto.from(user);
    }

    /** Trims/collapses an upstream error body to a short, readable snippet. */
    private String snippet(String text) {
        if (text == null) return "";
        String cleaned = text.replaceAll("\\s+", " ").trim();
        return cleaned.length() > 300 ? cleaned.substring(0, 300) : cleaned;
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
