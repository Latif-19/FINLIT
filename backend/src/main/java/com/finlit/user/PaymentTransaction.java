package com.finlit.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Records every Paystack transaction reference we've verified and consumed,
 * so a single successful payment can't be replayed to grant premium a second
 * time — to the same account or a different one.
 */
@Entity
@Table(name = "payment_transactions",
        uniqueConstraints = @UniqueConstraint(columnNames = "reference"))
@Getter
@Setter
@NoArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String reference;

    /** Amount actually verified with Paystack, in pesewas (GHS minor unit). */
    @Column(nullable = false)
    private long amount;

    @Column(nullable = false)
    private Instant verifiedAt = Instant.now();
}
