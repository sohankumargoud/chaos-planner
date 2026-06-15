package com.chaosplanner.service;

import com.chaosplanner.dto.user.UpdateProfileRequest;
import com.chaosplanner.dto.user.UserProfileResponse;
import com.chaosplanner.entity.User;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));
        java.util.List<String> roles = user.getRoles().stream()
            .map(com.chaosplanner.entity.Role::getName)
            .collect(java.util.stream.Collectors.toList());

        return new UserProfileResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getAvatarUrl(),
            roles
        );
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));

        user.setFullName(request.getFullName());

        if (request.getCurrentPassword() != null && !request.getCurrentPassword().isEmpty() && 
            request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                throw new ApiException("Current password is incorrect", HttpStatus.BAD_REQUEST, "INVALID_PASSWORD");
            }
            
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        java.util.List<String> roles = user.getRoles().stream()
            .map(com.chaosplanner.entity.Role::getName)
            .collect(java.util.stream.Collectors.toList());

        return new UserProfileResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getAvatarUrl(),
            roles
        );
    }
}
