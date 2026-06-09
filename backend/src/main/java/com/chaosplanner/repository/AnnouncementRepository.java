package com.chaosplanner.repository;

import com.chaosplanner.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    Page<Announcement> findByOrderByCreatedAtDesc(Pageable pageable);
    List<Announcement> findTop5ByOrderByCreatedAtDesc();
    List<Announcement> findByPriorityOrderByCreatedAtDesc(String priority);
    long countByPriority(String priority);
}
