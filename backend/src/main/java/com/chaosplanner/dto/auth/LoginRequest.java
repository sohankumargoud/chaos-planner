package com.chaosplanner.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim().toLowerCase();
    }

    @NotBlank(message = "Password is required")
    private String password;
}
