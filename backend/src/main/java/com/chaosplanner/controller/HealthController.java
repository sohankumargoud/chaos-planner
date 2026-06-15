package com.chaosplanner.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Endpoint to wake up the server and check health")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check server health status")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "Chaos Planner API is running smoothly."
        ));
    }
}
