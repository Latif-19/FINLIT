package com.finlit.simulation;

import com.finlit.gamification.BadgeService;
import com.finlit.simulation.dto.SimulationDto;
import com.finlit.simulation.dto.SimulationSaveRequest;
import com.finlit.simulation.dto.SimulationSaveResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Business logic for saving and listing a user's simulations. Saving one also
 * re-checks badges, which unlocks the "Explorer" badge on first use.
 */
@Service
public class SimulationService {

    private final SimulationRepository simulationRepository;
    private final BadgeService badgeService;

    public SimulationService(SimulationRepository simulationRepository, BadgeService badgeService) {
        this.simulationRepository = simulationRepository;
        this.badgeService = badgeService;
    }

    @Transactional
    public SimulationSaveResponse save(UUID userId, SimulationSaveRequest request) {
        Simulation simulation = new Simulation();
        simulation.setUserId(userId);
        simulation.setType(request.type());
        simulation.setParameters(request.parameters() == null ? Map.of() : request.parameters());
        simulation.setResult(request.result() == null ? Map.of() : request.result());
        simulationRepository.save(simulation);

        badgeService.evaluate(userId);

        return new SimulationSaveResponse(simulation.getId().toString(), simulation.getSavedAt().toString());
    }

    @Transactional(readOnly = true)
    public List<SimulationDto> getHistory(UUID userId) {
        return simulationRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(SimulationDto::from)
                .toList();
    }
}
