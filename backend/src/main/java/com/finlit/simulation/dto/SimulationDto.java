package com.finlit.simulation.dto;

import com.finlit.simulation.Simulation;

import java.util.Map;

/**
 * A full saved simulation returned in history — the minimal save response plus
 * the type and the stored inputs/outputs so the user can review it.
 */
public record SimulationDto(
        String id,
        String type,
        Map<String, Object> parameters,
        Map<String, Object> result,
        String savedAt
) {
    public static SimulationDto from(Simulation s) {
        return new SimulationDto(
                s.getId().toString(),
                s.getType(),
                s.getParameters(),
                s.getResult(),
                s.getSavedAt().toString()
        );
    }
}
