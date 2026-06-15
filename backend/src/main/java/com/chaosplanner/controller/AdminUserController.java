package com.chaosplanner.controller;

import com.chaosplanner.dto.user.UserProfileResponse;
import com.chaosplanner.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin Users", description = "Admin APIs for managing users and roles")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')") // ONLY full admins can access user management
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "List all users")
    public Page<UserProfileResponse> listUsers(@PageableDefault(size = 20) Pageable pageable) {
        return adminUserService.listUsers(pageable);
    }

    @PutMapping("/{id}/role")
    @Operation(summary = "Promote or demote a user")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable UUID id, 
            @RequestBody Map<String, String> payload) {
        String roleName = payload.get("role");
        adminUserService.updateUserRole(id, roleName);
        return ResponseEntity.ok().build();
    }
}
