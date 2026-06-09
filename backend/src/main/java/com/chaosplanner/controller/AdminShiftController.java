package com.chaosplanner.controller;

import com.chaosplanner.entity.VolunteerAssignment;
import com.chaosplanner.entity.VolunteerShift;
import com.chaosplanner.service.VolunteerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/shifts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Volunteer Shifts", description = "Shift management for admins")
@SecurityRequirement(name = "bearerAuth")
public class AdminShiftController {

    private final VolunteerService volunteerService;

    @GetMapping("/event/{eventId}")
    @Operation(summary = "List all shifts for an event")
    public List<VolunteerShift> getShifts(@PathVariable UUID eventId) {
        return volunteerService.getShiftsForEvent(eventId);
    }

    @PostMapping("/event/{eventId}")
    @Operation(summary = "Create a new volunteer shift")
    public ResponseEntity<VolunteerShift> createShift(
            @PathVariable UUID eventId,
            @RequestBody VolunteerShift shift) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(volunteerService.createShift(eventId, shift));
    }

    @PostMapping("/{shiftId}/assign/{userId}")
    @Operation(summary = "Assign a volunteer to a shift")
    public VolunteerAssignment assign(
            @PathVariable UUID shiftId,
            @PathVariable UUID userId) {
        return volunteerService.assignVolunteer(shiftId, userId);
    }

    @GetMapping("/{shiftId}/assignments")
    @Operation(summary = "Get all assignments for a shift")
    public List<VolunteerAssignment> getAssignments(@PathVariable UUID shiftId) {
        return volunteerService.getShiftAssignments(shiftId);
    }
}
