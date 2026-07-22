package com.finlit.progress.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/** Body for POST /progress/savings. */
public record LogSavingsRequest(
        @NotNull(message = "amount is required")
        @Positive(message = "amount must be greater than zero")
        Double amount
) {}
