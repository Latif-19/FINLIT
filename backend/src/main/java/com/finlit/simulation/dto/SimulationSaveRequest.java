package com.finlit.simulation.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

/**
 * Body for POST /simulations/save (frontend SimulationSaveRequest). The
 * parameters and result are whatever the specific simulator produced.
 */
public record SimulationSaveRequest(
        @NotBlank(message = "type is required")
        String type,

        Map<String, Object> parameters,

        Map<String, Object> result
) {}
