package com.chaosplanner.service;

import com.chaosplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final CheckInRepository checkInRepository;
    private final RoomConflictRepository conflictRepository;
    private final AnnouncementRepository announcementRepository;
    private final VolunteerShiftRepository shiftRepository;

    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        long totalEvents = eventRepository.count();
        long publishedEvents = eventRepository.countByStatus("PUBLISHED");
        long draftEvents = eventRepository.countByStatus("DRAFT");
        long cancelledEvents = eventRepository.countByStatus("CANCELLED");
        long unresolvedConflicts = conflictRepository.countByResolvedFalse();
        long urgentAnnouncements = announcementRepository.countByPriority("URGENT");

        // Registration counts
        long totalRegistrations = registrationRepository.count();
        long pendingApprovals = registrationRepository.findAll().stream()
            .filter(r -> "PENDING".equals(r.getStatus())).count();
        long waitlisted = registrationRepository.findAll().stream()
            .filter(r -> "WAITLISTED".equals(r.getStatus())).count();

        // Volunteer fill stats
        var allShifts = shiftRepository.findAll();
        long totalSlots = allShifts.stream().mapToLong(s -> s.getSlotsTotal()).sum();
        long filledSlots = allShifts.stream().mapToLong(s -> s.getSlotsFilled()).sum();
        long understaffedShifts = allShifts.stream()
            .filter(s -> s.getSlotsFilled() < s.getSlotsTotal()).count();

        metrics.put("totalEvents", totalEvents);
        metrics.put("publishedEvents", publishedEvents);
        metrics.put("draftEvents", draftEvents);
        metrics.put("cancelledEvents", cancelledEvents);
        metrics.put("totalRegistrations", totalRegistrations);
        metrics.put("pendingApprovals", pendingApprovals);
        metrics.put("waitlisted", waitlisted);
        metrics.put("unresolvedConflicts", unresolvedConflicts);
        metrics.put("urgentAnnouncements", urgentAnnouncements);
        metrics.put("totalVolunteerSlots", totalSlots);
        metrics.put("filledVolunteerSlots", filledSlots);
        metrics.put("understaffedShifts", understaffedShifts);
        metrics.put("volunteerFillRate", totalSlots > 0 ? (double) filledSlots / totalSlots * 100 : 0);

        return metrics;
    }
}
