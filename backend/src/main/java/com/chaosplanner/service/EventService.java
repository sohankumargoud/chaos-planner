package com.chaosplanner.service;

import com.chaosplanner.dto.event.EventRequest;
import com.chaosplanner.dto.event.EventResponse;
import com.chaosplanner.entity.Event;
import com.chaosplanner.entity.Room;
import com.chaosplanner.entity.User;
import com.chaosplanner.entity.Venue;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final RoomRepository roomRepository;
    private final RegistrationRepository registrationRepository;
    private final CheckInRepository checkInRepository;
    private final ClubRepository clubRepository;

    @Transactional
    public EventResponse createEvent(EventRequest req, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", organizerEmail));
        Event event = mapRequestToEvent(new Event(), req, organizer);
        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updateEvent(UUID id, EventRequest req, String email) {
        Event event = getEventById(id);
        User organizer = userRepository.findByEmail(email).orElseThrow();
        mapRequestToEvent(event, req, organizer);
        return toResponse(eventRepository.save(event));
    }

    public EventResponse getEvent(UUID id) {
        return toResponse(getEventById(id));
    }

    public Page<EventResponse> listAll(Pageable pageable) {
        return eventRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<EventResponse> listPublished(Pageable pageable) {
        return eventRepository.findByStatus("PUBLISHED", pageable).map(this::toResponse);
    }

    @Transactional
    public EventResponse updateStatus(UUID id, String newStatus) {
        Event event = getEventById(id);
        validateStatusTransition(event.getStatus(), newStatus);
        event.setStatus(newStatus);
        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(UUID id) {
        eventRepository.delete(getEventById(id));
    }

    private void validateStatusTransition(String current, String next) {
        if ("CANCELLED".equals(current)) {
            throw new ApiException("Cannot change status of a cancelled event", HttpStatus.BAD_REQUEST, "INVALID_TRANSITION");
        }
    }

    private Event mapRequestToEvent(Event event, EventRequest req, User organizer) {
        event.setTitle(req.getTitle());
        event.setOrganizer(organizer);
        event.setDescription(req.getDescription());
        event.setCategory(req.getCategory());
        event.setEventDate(req.getEventDate());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setCapacity(req.getCapacity());
        event.setRegistrationOpenAt(req.getRegistrationOpenAt());
        event.setRegistrationCloseAt(req.getRegistrationCloseAt());
        event.setApprovalRequired(req.isApprovalRequired());
        event.setBannerUrl(req.getBannerUrl());

        if (req.getVenueId() != null) {
            Venue venue = venueRepository.findById(req.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue", String.valueOf(req.getVenueId())));
            event.setVenue(venue);
        }
        if (req.getRoomId() != null) {
            Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", String.valueOf(req.getRoomId())));
            event.setRoom(room);
        }
        if (req.getClubId() != null) {
            com.chaosplanner.entity.Club club = clubRepository.findById(req.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException("Club", String.valueOf(req.getClubId())));
            event.setClub(club);
        }
        return event;
    }

    public EventResponse toResponse(Event e) {
        EventResponse r = new EventResponse();
        r.setId(e.getId());
        r.setTitle(e.getTitle());
        r.setOrganizerName(e.getOrganizer() != null ? e.getOrganizer().getFullName() : null);
        r.setOrganizerId(e.getOrganizer() != null ? e.getOrganizer().getId() : null);
        r.setDescription(e.getDescription());
        r.setCategory(e.getCategory());
        r.setEventDate(e.getEventDate());
        r.setStartTime(e.getStartTime());
        r.setEndTime(e.getEndTime());
        r.setCapacity(e.getCapacity());
        r.setApprovalRequired(e.isApprovalRequired());
        r.setStatus(e.getStatus());
        r.setBannerUrl(e.getBannerUrl());
        r.setRegistrationOpenAt(e.getRegistrationOpenAt());
        r.setRegistrationCloseAt(e.getRegistrationCloseAt());
        r.setCreatedAt(e.getCreatedAt());
        r.setUpdatedAt(e.getUpdatedAt());

        if (e.getClub() != null) {
            r.setClubId(e.getClub().getId());
            r.setClubName(e.getClub().getName());
        }

        if (e.getVenue() != null) {
            r.setVenueId(e.getVenue().getId());
            r.setVenueName(e.getVenue().getName());
        }
        if (e.getRoom() != null) {
            r.setRoomId(e.getRoom().getId());
            r.setRoomName(e.getRoom().getName());
        }

        // Counts
        r.setRegistrationCount(registrationRepository.countByEventAndStatus(e, "APPROVED"));
        r.setWaitlistCount(registrationRepository.countByEventAndStatus(e, "WAITLISTED"));
        r.setCheckedInCount(checkInRepository.countByCheckedInTrueAndRegistrationEventId(e.getId()));

        return r;
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Event", id.toString()));
    }
}
