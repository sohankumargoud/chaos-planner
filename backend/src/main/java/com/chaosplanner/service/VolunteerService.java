package com.chaosplanner.service;

import com.chaosplanner.entity.*;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerShiftRepository shiftRepository;
    private final VolunteerAssignmentRepository assignmentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public List<VolunteerShift> getShiftsForEvent(UUID eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId.toString()));
        return shiftRepository.findByEvent(event);
    }

    @Transactional
    public VolunteerShift createShift(UUID eventId, VolunteerShift shift) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", eventId.toString()));
        shift.setEvent(event);
        return shiftRepository.save(shift);
    }

    @Transactional
    public VolunteerAssignment assignVolunteer(UUID shiftId, UUID userId) {
        VolunteerShift shift = shiftRepository.findById(shiftId)
            .orElseThrow(() -> new ResourceNotFoundException("Shift", shiftId.toString()));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        if (shift.getSlotsFilled() >= shift.getSlotsTotal()) {
            throw new ApiException("No open slots in this shift", HttpStatus.CONFLICT, "SHIFT_FULL");
        }
        if (assignmentRepository.findByShiftAndUser(shift, user).isPresent()) {
            throw new ApiException("User already assigned to this shift", HttpStatus.CONFLICT, "ALREADY_ASSIGNED");
        }

        VolunteerAssignment assignment = new VolunteerAssignment();
        assignment.setShift(shift);
        assignment.setUser(user);
        assignment.setStatus("ASSIGNED");

        shift.setSlotsFilled(shift.getSlotsFilled() + 1);
        shiftRepository.save(shift);

        return assignmentRepository.save(assignment);
    }

    @Transactional
    public VolunteerAssignment claimShift(UUID shiftId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", userEmail));
        return assignVolunteer(shiftId, user.getId());
    }

    public List<VolunteerAssignment> getUserAssignments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", userEmail));
        return assignmentRepository.findByUser(user);
    }

    public List<VolunteerAssignment> getShiftAssignments(UUID shiftId) {
        VolunteerShift shift = shiftRepository.findById(shiftId)
            .orElseThrow(() -> new ResourceNotFoundException("Shift", shiftId.toString()));
        return assignmentRepository.findByShift(shift);
    }
}
