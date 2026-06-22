package com.chaosplanner.dto.club;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateClubRequest {
    @NotBlank(message = "Club name is required")
    private String name;
    private String description;
    private String logoUrl;
}
