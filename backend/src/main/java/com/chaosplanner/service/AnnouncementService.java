package com.chaosplanner.service;

import com.chaosplanner.entity.*;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Transactional
    public Announcement createAnnouncement(Announcement announcement, String creatorEmail, UUID eventId) {
        User creator = userRepository.findByEmail(creatorEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", creatorEmail));
        announcement.setCreatedBy(creator);
        announcement.setPublishedAt(LocalDateTime.now());

        if (eventId != null) {
            Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId.toString()));
            announcement.setEvent(event);
        }

        Announcement saved = announcementRepository.save(announcement);
        broadcastNotification(saved);
        return saved;
    }

    public Page<Announcement> listAnnouncements(Pageable pageable) {
        return announcementRepository.findByOrderByCreatedAtDesc(pageable);
    }

    public List<Announcement> getRecentAnnouncements() {
        return announcementRepository.findTop5ByOrderByCreatedAtDesc();
    }

    public Page<Notification> getUserNotifications(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", userEmail));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", userEmail));
        return notificationRepository.countByUserAndReadFalse(user);
    }

    @Transactional
    public void markRead(UUID notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId.toString()));
        notif.setRead(true);
        notificationRepository.save(notif);
    }

    private void broadcastNotification(Announcement announcement) {
        // For demo: broadcast to all verified users
        // In production: filter by targetAudience (event registrants, volunteers, etc.)
        List<User> users = userRepository.findAll();
        for (User u : users) {
            if (!u.isVerified()) continue;
            Notification notif = new Notification();
            notif.setUser(u);
            notif.setAnnouncement(announcement);
            notif.setTitle(announcement.getTitle());
            notif.setBody(announcement.getBody());
            notificationRepository.save(notif);
        }
        log.info("Broadcasted announcement '{}' to users", announcement.getTitle());
    }
}
