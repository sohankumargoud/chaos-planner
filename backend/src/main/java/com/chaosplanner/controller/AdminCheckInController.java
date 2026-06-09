package com.chaosplanner.controller;

import com.chaosplanner.entity.CheckIn;
import com.chaosplanner.service.CheckInService;
import com.chaosplanner.service.QrCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/checkins")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Check-In", description = "QR code scanning and check-in management")
@SecurityRequirement(name = "bearerAuth")
public class AdminCheckInController {

    private final CheckInService checkInService;
    private final QrCodeService qrCodeService;

    @PostMapping("/scan")
    @Operation(summary = "Scan a QR token and mark attendee as checked in")
    public CheckIn scanQr(
            @RequestParam String qrToken,
            Authentication auth) {
        return checkInService.scanQr(qrToken, auth.getName());
    }

    @GetMapping("/qr-image")
    @Operation(summary = "Get QR code PNG for a token")
    public ResponseEntity<byte[]> getQrImage(@RequestParam String qrToken) {
        byte[] png = qrCodeService.generateQrPng(qrToken);
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(png);
    }

    @GetMapping("/status")
    @Operation(summary = "Get check-in status for a QR token")
    public CheckIn getStatus(@RequestParam String qrToken) {
        return checkInService.getCheckInByToken(qrToken);
    }
}
