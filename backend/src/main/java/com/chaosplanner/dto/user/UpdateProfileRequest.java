package com.chaosplanner.dto.user;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class UpdateProfileRequest {
    @NotBlank
    private String fullName;
    
    private String currentPassword;
    private String newPassword;
}
