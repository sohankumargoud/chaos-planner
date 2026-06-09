package com.chaosplanner.controller;

import com.chaosplanner.entity.Notification;
import com.chaosplanner.entity.VolunteerAssignment;
import com.chaosplanner.repository.CheckInRepository;
import com.chaosplanner.repository.UserRepository;
import com.chaosplanner.service.AnnouncementService;
import com.chaosplanner.service.QrCodeService;
import com.chaosplanner.service.VolunteerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User - Extras", description = "Notifications, shifts, QR pass")
@SecurityRequirement(name = "bearerAuth")
public class UserExtrasController {

    private final AnnouncementService announcementService;
    private final VolunteerService volunteerService;
    private final QrCodeService qrCodeService;
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;

    @GetMapping("/my-notifications")
    @Operation(summary = "Get my notifications")
    public Page<Notification> getNotifications(
            Authentication auth,
            @PageableDefault(size = 20) Pageable pageable) {
        return announcementService.getUserNotifications(auth.getName(), pageable);
    }

    @GetMapping("/my-notifications/unread-count")
    @Operation(summary = "Get unread notification count")
    public Map<String, Long> unreadCount(Authentication auth) {
        return Map.of("count", announcementService.getUnreadCount(auth.getName()));
    }

    @PatchMapping("/my-notifications/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<Void> markRead(@PathVariable UUID id) {
        announcementService.markRead(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-shifts")
    @Operation(summary = "Get my volunteer assignments")
    public List<VolunteerAssignment> myShifts(Authentication auth) {
        return volunteerService.getUserAssignments(auth.getName());
    }

    @PostMapping("/shifts/{shiftId}/claim")
    @Operation(summary = "Claim an open volunteer shift")
    public VolunteerAssignment claimShift(
            @PathVariable UUID shiftId,
            Authentication auth) {
        return volunteerService.claimShift(shiftId, auth.getName());
    }

    @GetMapping("/my-qr/{registrationId}")
    @Operation(summary = "Get QR pass PNG for a registration")
    public ResponseEntity<byte[]> getQrPass(
            @PathVariable UUID registrationId) {
        var checkIn = checkInRepository.findAll().stream()
            .filter(c -> c.getRegistration().getId().equals(registrationId))
            .findFirst()
            .orElseThrow(() -> new com.chaosplanner.exception.ResourceNotFoundException("CheckIn", registrationId.toString()));
        byte[] png = qrCodeService.generateQrPng(checkIn.getQrToken());
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(png);
    }
}
