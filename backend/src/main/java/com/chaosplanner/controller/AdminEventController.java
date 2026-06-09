package com.chaosplanner.controller;

import com.chaosplanner.dto.event.EventRequest;
import com.chaosplanner.dto.event.EventResponse;
import com.chaosplanner.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Events", description = "Event management for admins")
@SecurityRequirement(name = "bearerAuth")
public class AdminEventController {

    private final EventService eventService;

    @GetMapping
    @Operation(summary = "List all events with pagination")
    public Page<EventResponse> listAll(@PageableDefault(size = 20) Pageable pageable) {
        return eventService.listAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public EventResponse getEvent(@PathVariable UUID id) {
        return eventService.getEvent(id);
    }

    @PostMapping
    @Operation(summary = "Create a new event")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(eventService.createEvent(request, auth.getName()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an event")
    public EventResponse updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventRequest request,
            Authentication auth) {
        return eventService.updateEvent(id, request, auth.getName());
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Change event status (PUBLISHED, PAUSED, CANCELLED, DRAFT)")
    public EventResponse updateStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return eventService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }
}
