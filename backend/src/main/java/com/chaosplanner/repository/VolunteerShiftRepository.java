package com.chaosplanner.repository;

import com.chaosplanner.entity.Event;
import com.chaosplanner.entity.VolunteerShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VolunteerShiftRepository extends JpaRepository<VolunteerShift, UUID> {
    List<VolunteerShift> findByEvent(Event event);
    List<VolunteerShift> findByEventAndSlotsTotalGreaterThan(Event event, int slots);
}
