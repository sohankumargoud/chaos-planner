package com.chaosplanner.dto.event;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class EventRequest {

    @NotBlank @Size(max = 255)
    private String title;

    private String description;

    @Size(max = 80)
    private String category;

    private Integer venueId;
    private Integer roomId;
    private java.util.UUID clubId;


    @NotNull
    private LocalDate eventDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @Positive
    private Integer capacity = 100;

    private LocalDateTime registrationOpenAt;
    private LocalDateTime registrationCloseAt;
    private boolean approvalRequired = false;
    private String bannerUrl;
}
