package com.chaosplanner.repository;

import com.chaosplanner.entity.User;
import com.chaosplanner.entity.VolunteerAssignment;
import com.chaosplanner.entity.VolunteerShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VolunteerAssignmentRepository extends JpaRepository<VolunteerAssignment, UUID> {
    Optional<VolunteerAssignment> findByShiftAndUser(VolunteerShift shift, User user);
    List<VolunteerAssignment> findByUser(User user);
    List<VolunteerAssignment> findByShift(VolunteerShift shift);
}
