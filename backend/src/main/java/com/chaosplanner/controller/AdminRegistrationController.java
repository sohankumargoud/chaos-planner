package com.chaosplanner.controller;

import com.chaosplanner.entity.Registration;
import com.chaosplanner.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/registrations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Registrations", description = "Registration management for admins")
@SecurityRequirement(name = "bearerAuth")
public class AdminRegistrationController {

    private final RegistrationService registrationService;

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get all registrations for an event")
    public List<Registration> getEventRegistrations(@PathVariable UUID eventId) {
        return registrationService.getEventRegistrations(eventId);
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "Approve a pending registration")
    public Registration approve(@PathVariable UUID id) {
        return registrationService.approveRegistration(id);
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject a registration")
    public Registration reject(@PathVariable UUID id) {
        return registrationService.rejectRegistration(id);
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a registration")
    public Registration cancel(@PathVariable UUID id) {
        return registrationService.cancelRegistration(id);
    }
}
