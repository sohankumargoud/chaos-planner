package com.chaosplanner.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank @Email
    private String email;

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim().toLowerCase();
    }
    @NotBlank
    private String otpCode;
    @NotBlank @Size(min = 8)
    private String newPassword;
}
