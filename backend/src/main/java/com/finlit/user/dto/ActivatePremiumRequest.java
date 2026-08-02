package com.finlit.user.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Body for POST /profile/premium — the Paystack transaction reference the
 * client just completed checkout with. The backend re-verifies it with
 * Paystack directly before granting premium; the client can't just assert
 * success.
 */
public record ActivatePremiumRequest(
        @NotBlank(message = "Payment reference is required")
        String reference
) {}
