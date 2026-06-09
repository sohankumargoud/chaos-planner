package com.chaosplanner.repository;

import com.chaosplanner.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    Page<Event> findByStatus(String status, Pageable pageable);

    List<Event> findByStatus(String status);

    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(e.category) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Event> searchPublished(String q, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.status = :status")
    long countByStatus(String status);
}
