package com.chaosplanner.controller;

import com.chaosplanner.dto.event.EventResponse;
import com.chaosplanner.dto.user.UpdateProfileRequest;
import com.chaosplanner.dto.user.UserProfileResponse;
import com.chaosplanner.entity.Registration;
import com.chaosplanner.service.EventService;
import com.chaosplanner.service.RegistrationService;
import com.chaosplanner.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "User-facing APIs for events and registrations")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final EventService eventService;
    private final RegistrationService registrationService;
    private final UserService userService;

    // ---- Profile ----

    @GetMapping("/profile")
    @Operation(summary = "Get user profile")
    public UserProfileResponse getProfile(Authentication auth) {
        return userService.getProfile(auth.getName());
    }

    @PatchMapping("/profile")
    @Operation(summary = "Update user profile")
    public UserProfileResponse updateProfile(@RequestBody UpdateProfileRequest request, Authentication auth) {
        return userService.updateProfile(auth.getName(), request);
    }

    // ---- Events ----

    @GetMapping("/events")
    @Operation(summary = "Browse published events")
    public Page<EventResponse> browseEvents(@PageableDefault(size = 12) Pageable pageable) {
        return eventService.listPublished(pageable);
    }

    @GetMapping("/events/{id}")
    @Operation(summary = "Get event detail")
    public EventResponse getEvent(@PathVariable UUID id) {
        return eventService.getEvent(id);
    }

    // ---- Registrations ----

    @PostMapping("/events/{id}/register")
    @Operation(summary = "Register for an event")
    public ResponseEntity<Registration> register(
            @PathVariable UUID id,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(registrationService.register(id, auth.getName()));
    }

    @GetMapping("/registrations")
    @Operation(summary = "Get my registrations")
    public List<Registration> myRegistrations(Authentication auth) {
        return registrationService.getUserRegistrations(auth.getName());
    }

    @PatchMapping("/registrations/{id}/cancel")
    @Operation(summary = "Cancel my registration")
    public Registration cancel(@PathVariable UUID id) {
        return registrationService.cancelRegistration(id);
    }
}
