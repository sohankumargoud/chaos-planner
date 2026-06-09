package com.chaosplanner.repository;

import com.chaosplanner.entity.CheckIn;
import com.chaosplanner.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, UUID> {
    Optional<CheckIn> findByQrToken(String qrToken);
    Optional<CheckIn> findByRegistration(Registration registration);
    long countByCheckedInTrueAndRegistrationEventId(UUID eventId);
}
