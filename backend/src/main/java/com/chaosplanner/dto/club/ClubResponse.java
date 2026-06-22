package com.chaosplanner.dto.club;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ClubResponse {
    private UUID id;
    private String name;
    private String description;
    private String logoUrl;
    private LocalDateTime createdAt;
}
