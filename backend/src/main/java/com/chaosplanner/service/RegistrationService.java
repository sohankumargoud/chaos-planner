package com.chaosplanner.service;

import com.chaosplanner.entity.*;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final CheckInRepository checkInRepository;
    private final QrCodeService qrCodeService;

    @Transactional
    public Registration register(UUID eventId, String userEmail) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId.toString()));
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", userEmail));

        if (!"PUBLISHED".equals(event.getStatus())) {
            throw new ApiException("Event is not open for registration", HttpStatus.BAD_REQUEST, "EVENT_NOT_OPEN");
        }

        if (registrationRepository.findByEventAndUser(event, user).isPresent()) {
            throw new ApiException("Already registered for this event", HttpStatus.CONFLICT, "ALREADY_REGISTERED");
        }

        long activeCount = registrationRepository.countActiveByEventId(eventId);
        Registration reg = new Registration();
        reg.setEvent(event);
        reg.setUser(user);

        if (activeCount >= event.getCapacity()) {
            // Add to waitlist
            int nextPos = registrationRepository.findMaxWaitlistPos(event).orElse(0) + 1;
            reg.setStatus("WAITLISTED");
            reg.setWaitlistPos(nextPos);
        } else if (event.isApprovalRequired()) {
            reg.setStatus("PENDING");
        } else {
            reg.setStatus("APPROVED");
            reg.setApprovedAt(LocalDateTime.now());
        }

        Registration saved = registrationRepository.save(reg);

        if ("APPROVED".equals(saved.getStatus())) {
            generateQrCode(saved);
        }

        return saved;
    }

    @Transactional
    public Registration approveRegistration(UUID registrationId) {
        Registration reg = getById(registrationId);
        if (!"PENDING".equals(reg.getStatus())) {
            throw new ApiException("Registration is not in PENDING status", HttpStatus.BAD_REQUEST, "INVALID_STATUS");
        }
        reg.setStatus("APPROVED");
        reg.setApprovedAt(LocalDateTime.now());
        Registration saved = registrationRepository.save(reg);
        generateQrCode(saved);
        return saved;
    }

    @Transactional
    public Registration rejectRegistration(UUID registrationId) {
        Registration reg = getById(registrationId);
        reg.setStatus("REJECTED");
        return registrationRepository.save(reg);
    }

    @Transactional
    public Registration cancelRegistration(UUID registrationId) {
        Registration reg = getById(registrationId);
        reg.setStatus("CANCELLED");
        reg.setCancelledAt(LocalDateTime.now());
        return registrationRepository.save(reg);
    }

    public List<Registration> getEventRegistrations(UUID eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId.toString()));
        return registrationRepository.findByEvent(event);
    }

    public List<Registration> getUserRegistrations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", userEmail));
        return registrationRepository.findByUser(user);
    }

    private void generateQrCode(Registration reg) {
        if (checkInRepository.findByRegistration(reg).isEmpty()) {
            String qrToken = "QR-" + reg.getUser().getId().toString().substring(0, 8).toUpperCase()
                + "-" + reg.getEvent().getId().toString().substring(0, 8).toUpperCase()
                + "-" + System.currentTimeMillis();
            CheckIn checkIn = new CheckIn();
            checkIn.setRegistration(reg);
            checkIn.setQrToken(qrToken);
            checkInRepository.save(checkIn);
        }
    }

    public Registration getById(UUID id) {
        return registrationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Registration", id.toString()));
    }
}
