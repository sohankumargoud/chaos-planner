package com.chaosplanner.controller;

import com.chaosplanner.dto.club.ClubResponse;
import com.chaosplanner.dto.club.CreateClubRequest;
import com.chaosplanner.service.AdminClubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clubs")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin Clubs", description = "Endpoints for admins to manage clubs")
@PreAuthorize("hasAnyRole('ADMIN', 'SUB_ADMIN')")
public class AdminClubController {

    private final AdminClubService adminClubService;

    @PostMapping
    @Operation(summary = "Create a new club")
    public ResponseEntity<ClubResponse> createClub(
            @Valid @RequestBody CreateClubRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminClubService.createClub(request, authentication.getName()));
    }

    @GetMapping
    @Operation(summary = "List clubs managed by the current admin")
    public ResponseEntity<List<ClubResponse>> listMyClubs(Authentication authentication) {
        return ResponseEntity.ok(adminClubService.listMyClubs(authentication.getName()));
    }
}
