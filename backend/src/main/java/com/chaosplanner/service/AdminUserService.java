package com.chaosplanner.service;

import com.chaosplanner.dto.user.UserProfileResponse;
import com.chaosplanner.entity.Role;
import com.chaosplanner.entity.User;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.RoleRepository;
import com.chaosplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public Page<UserProfileResponse> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(user -> {
            List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
            return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                roles
            );
        });
    }

    @Transactional
    public void updateUserRole(UUID userId, String roleName) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));
        
        // Don't allow modifying the super admin (admin@chaos.dev) to prevent accidental lockout
        if ("admin@chaos.dev".equals(user.getEmail())) {
            throw new ApiException("Cannot modify the default super admin account.", HttpStatus.FORBIDDEN, "FORBIDDEN");
        }

        Role newRole = roleRepository.findByName(roleName)
            .orElseThrow(() -> new ApiException("Role not found", HttpStatus.BAD_REQUEST, "INVALID_ROLE"));

        // Keep ROLE_USER for everyone, clear other roles, and add the new one
        Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();
        user.getRoles().clear();
        user.getRoles().add(userRole);
        
        // Only add the new role if it's not ROLE_USER (since we already added it)
        if (!"ROLE_USER".equals(roleName)) {
            user.getRoles().add(newRole);
        }

        userRepository.save(user);
    }
}
