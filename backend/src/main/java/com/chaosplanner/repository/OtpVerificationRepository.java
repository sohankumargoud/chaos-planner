package com.chaosplanner.repository;

import com.chaosplanner.entity.OtpVerification;
import com.chaosplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Integer> {

    Optional<OtpVerification> findTopByUserAndOtpTypeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
        User user, String otpType, LocalDateTime now);

    List<OtpVerification> findAllByUserAndOtpType(User user, String otpType);
}
