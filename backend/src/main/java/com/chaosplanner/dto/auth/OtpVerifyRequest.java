package com.chaosplanner.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpVerifyRequest {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String otpCode;
    @NotBlank
    private String otpType; // SIGNUP, FORGOT_PASSWORD
}
