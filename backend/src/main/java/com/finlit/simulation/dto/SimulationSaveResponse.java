package com.finlit.simulation.dto;

/** Returned by POST /simulations/save (frontend SimulationSaveResponse). */
public record SimulationSaveResponse(
        String id,
        String savedAt
) {}
