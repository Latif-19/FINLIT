package com.finlit.simulation;

import com.finlit.simulation.dto.SimulationDto;
import com.finlit.simulation.dto.SimulationSaveRequest;
import com.finlit.simulation.dto.SimulationSaveResponse;
import com.finlit.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Simulation endpoints (require a token):
 *   POST /api/simulations/save
 *   GET  /api/simulations/history
 */
@RestController
@RequestMapping("/simulations")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/save")
    public SimulationSaveResponse save(@AuthenticationPrincipal User user,
                                       @Valid @RequestBody SimulationSaveRequest request) {
        return simulationService.save(user.getId(), request);
    }

    @GetMapping("/history")
    public List<SimulationDto> getHistory(@AuthenticationPrincipal User user) {
        return simulationService.getHistory(user.getId());
    }
}
