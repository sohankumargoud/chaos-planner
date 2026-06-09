package com.chaosplanner.controller;

import com.chaosplanner.entity.Announcement;
import com.chaosplanner.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/announcements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Announcements", description = "Announcement management")
@SecurityRequirement(name = "bearerAuth")
public class AdminAnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    @Operation(summary = "List all announcements")
    public Page<Announcement> list(@PageableDefault(size = 20) Pageable pageable) {
        return announcementService.listAnnouncements(pageable);
    }

    @PostMapping
    @Operation(summary = "Create and publish an announcement")
    public ResponseEntity<Announcement> create(
            @RequestBody Announcement announcement,
            @RequestParam(required = false) UUID eventId,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(announcementService.createAnnouncement(announcement, auth.getName(), eventId));
    }
}
