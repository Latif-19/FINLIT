package com.finlit.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/** Data access for consumed Paystack payment references. */
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {

    boolean existsByReference(String reference);
}
