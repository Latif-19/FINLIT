package com.finlit.simulation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Data access for saved simulations. */
public interface SimulationRepository extends JpaRepository<Simulation, UUID> {

    /** A user's saved simulations, newest first. */
    List<Simulation> findByUserIdOrderBySavedAtDesc(UUID userId);

    boolean existsByUserId(UUID userId);
}
