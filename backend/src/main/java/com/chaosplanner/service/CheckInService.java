package com.chaosplanner.service;

import com.chaosplanner.entity.*;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.exception.ResourceNotFoundException;
import com.chaosplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;

    @Transactional
    public CheckIn scanQr(String qrToken, String adminEmail) {
        CheckIn checkIn = checkInRepository.findByQrToken(qrToken)
            .orElseThrow(() -> new ResourceNotFoundException("QR Token", qrToken));

        if (checkIn.isCheckedIn()) {
            throw new ApiException("Attendee already checked in", HttpStatus.CONFLICT, "ALREADY_CHECKED_IN");
        }

        User admin = userRepository.findByEmail(adminEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", adminEmail));

        checkIn.setCheckedIn(true);
        checkIn.setCheckedInAt(LocalDateTime.now());
        checkIn.setCheckedInBy(admin);

        return checkInRepository.save(checkIn);
    }

    public CheckIn getCheckInByToken(String qrToken) {
        return checkInRepository.findByQrToken(qrToken)
            .orElseThrow(() -> new ResourceNotFoundException("QR Token", qrToken));
    }
}
