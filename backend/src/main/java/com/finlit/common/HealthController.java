package com.finlit.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * A simple "is the backend alive?" endpoint.
 *
 * Once the app is running, visiting http://localhost:3000/api/health in a
 * browser (or calling it from the app) returns a small JSON object. This is the
 * very first thing we use to confirm everything is wired up correctly.
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "ok",
                "service", "finlit-backend",
                "time", Instant.now().toString()
        );
    }
}
