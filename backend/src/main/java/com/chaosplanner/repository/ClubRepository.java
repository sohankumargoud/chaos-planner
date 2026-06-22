package com.chaosplanner.repository;

import com.chaosplanner.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ClubRepository extends JpaRepository<Club, UUID> {
    boolean existsByName(String name);
}
