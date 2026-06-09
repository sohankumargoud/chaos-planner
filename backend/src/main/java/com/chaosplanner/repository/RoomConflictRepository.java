package com.chaosplanner.repository;

import com.chaosplanner.entity.Room;
import com.chaosplanner.entity.RoomConflict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomConflictRepository extends JpaRepository<RoomConflict, Integer> {
    List<RoomConflict> findByResolvedFalse();
    List<RoomConflict> findByRoom(Room room);
    long countByResolvedFalse();
}
