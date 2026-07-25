package com.finlit.simulation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * A saved "what-if" simulation (loan/investment/etc.). Calculations happen in
 * the app; the backend just stores the inputs the user chose and the result
 * they got, so they can revisit their history.
 *
 * `parameters` and `result` are free-form key/value data, stored as PostgreSQL
 * JSON columns so any simulator's shape fits without schema changes.
 */
@Entity
@Table(name = "simulations")
@Getter
@Setter
@NoArgsConstructor
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String type;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> parameters;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> result;

    @Column(nullable = false)
    private Instant savedAt = Instant.now();
}
