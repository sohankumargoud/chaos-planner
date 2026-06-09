package com.chaosplanner.controller;

import com.chaosplanner.dto.auth.*;
import com.chaosplanner.entity.User;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.UserRepository;
import com.chaosplanner.service.AuthService;
import com.chaosplanner.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Auth endpoints for signup, login, OTP, password reset")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "Account created. Please verify with the OTP sent to your email."));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP code to activate account or reset password")
    public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User", request.getEmail()));
        otpService.verifyOtp(user, request.getOtpCode(), request.getOtpType());
        return ResponseEntity.ok(Map.of("message", "OTP verified successfully."));
    }

    @PostMapping("/resend-otp")
    @Operation(summary = "Resend OTP code")
    public ResponseEntity<Map<String, String>> resendOtp(
            @RequestParam String email,
            @RequestParam String otpType) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
        otpService.resendOtp(user, otpType);
        return ResponseEntity.ok(Map.of("message", "New OTP sent."));
    }

    @PostMapping("/user/login")
    @Operation(summary = "User login portal")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginUser(request));
    }

    @PostMapping("/admin/login")
    @Operation(summary = "Admin login portal")
    public ResponseEntity<AuthResponse> loginAdmin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Send password reset OTP")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset OTP sent to your email."));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using OTP")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
    }
}
