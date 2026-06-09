package com.chaosplanner.repository;

import com.chaosplanner.entity.Event;
import com.chaosplanner.entity.Registration;
import com.chaosplanner.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

    Optional<Registration> findByEventAndUser(Event event, User user);

    Page<Registration> findByEvent(Event event, Pageable pageable);

    List<Registration> findByEvent(Event event);

    List<Registration> findByUser(User user);

    List<Registration> findByEventAndStatus(Event event, String status);

    long countByEventAndStatus(Event event, String status);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.id = :eventId AND r.status IN ('APPROVED', 'PENDING')")
    long countActiveByEventId(UUID eventId);

    @Query("SELECT MAX(r.waitlistPos) FROM Registration r WHERE r.event = :event AND r.status = 'WAITLISTED'")
    Optional<Integer> findMaxWaitlistPos(Event event);
}
