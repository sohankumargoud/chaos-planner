package com.chaosplanner.service;

import com.chaosplanner.dto.auth.*;
import com.chaosplanner.entity.Role;
import com.chaosplanner.entity.User;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.RoleRepository;
import com.chaosplanner.repository.UserRepository;
import com.chaosplanner.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final OtpService otpService;

    @org.springframework.beans.factory.annotation.Value("${app.admin.secret-code}")
    private String adminSecretCode;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT, "EMAIL_TAKEN");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
            .orElseThrow(() -> new ApiException("Role not configured", HttpStatus.INTERNAL_SERVER_ERROR, "ROLE_MISSING"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        user.getRoles().add(userRole);

        userRepository.save(user);

        // Send OTP
        otpService.sendOtp(user, "SIGNUP");
        log.info("New user registered: {}", user.getEmail());
    }

    @Transactional
    public void signupAdmin(AdminSignupRequest request) {
        if (!request.getSecretCode().equals(adminSecretCode)) {
            throw new ApiException("Invalid admin registration code", HttpStatus.FORBIDDEN, "INVALID_SECRET");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT, "EMAIL_TAKEN");
        }

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
            .orElseThrow(() -> new ApiException("Role not configured", HttpStatus.INTERNAL_SERVER_ERROR, "ROLE_MISSING"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        user.getRoles().add(adminRole);

        userRepository.save(user);

        // Send OTP
        otpService.sendOtp(user, "SIGNUP");
        log.info("New admin registered: {}", user.getEmail());
    }

    public AuthResponse loginUser(LoginRequest request) {
        return authenticate(request, "ROLE_USER");
    }

    public AuthResponse loginAdmin(LoginRequest request) {
        return authenticate(request, "ROLE_ADMIN");
    }

    private AuthResponse authenticate(LoginRequest request, String requiredRole) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (DisabledException e) {
            throw new ApiException("Account not verified. Please verify your OTP.", HttpStatus.FORBIDDEN, "NOT_VERIFIED");
        } catch (BadCredentialsException e) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        boolean hasRole = userDetails.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals(requiredRole));

        if (!hasRole) {
            throw new ApiException("Access denied for this login portal", HttpStatus.FORBIDDEN, "WRONG_PORTAL");
        }

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
            .map(a -> a.getAuthority())
            .collect(Collectors.toList());

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), roles);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User", request.getEmail()));
        otpService.sendOtp(user, "FORGOT_PASSWORD");
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User", request.getEmail()));
        otpService.verifyOtp(user, request.getOtpCode(), "FORGOT_PASSWORD");
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
