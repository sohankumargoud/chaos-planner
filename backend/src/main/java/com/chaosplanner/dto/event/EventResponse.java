package com.chaosplanner.dto.event;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class EventResponse {
    private UUID id;
    private String title;
    private String organizerName;
    private UUID organizerId;
    private UUID clubId;
    private String clubName;
    private String description;
    private String category;
    private String venueName;
    private Integer venueId;
    private String roomName;
    private Integer roomId;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacity;
    private long registrationCount;
    private long waitlistCount;
    private long checkedInCount;
    private LocalDateTime registrationOpenAt;
    private LocalDateTime registrationCloseAt;
    private boolean approvalRequired;
    private String status;
    private String bannerUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
