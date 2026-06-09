package com.chaosplanner.service;

import com.chaosplanner.entity.OtpVerification;
import com.chaosplanner.entity.User;
import com.chaosplanner.exception.OtpException;
import com.chaosplanner.repository.OtpVerificationRepository;
import com.chaosplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Value("${app.otp.expiry-minutes:10}")
    private int expiryMinutes;

    @Value("${app.otp.length:6}")
    private int otpLength;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.from:noreply@chaosplanner.app}")
    private String mailFrom;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public void sendOtp(User user, String otpType) {
        // Invalidate previous OTPs of same type
        List<OtpVerification> existing = otpRepository.findAllByUserAndOtpType(user, otpType);
        existing.forEach(o -> o.setUsed(true));
        otpRepository.saveAll(existing);

        String code = generateCode();

        OtpVerification otp = new OtpVerification();
        otp.setUser(user);
        otp.setOtpCode(code);
        otp.setOtpType(otpType);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));
        otpRepository.save(otp);

        // Pluggable provider — currently CONSOLE
        deliverOtp(user.getEmail(), code, otpType);
    }

    @Transactional
    public void verifyOtp(User user, String code, String otpType) {
        OtpVerification otp = otpRepository
            .findTopByUserAndOtpTypeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                user, otpType, LocalDateTime.now())
            .orElseThrow(() -> new OtpException(
                "OTP expired or not found. Please request a new one.", "OTP_EXPIRED"));

        if (otp.getAttempts() >= 3) {
            otp.setUsed(true); // Invalidate
            otpRepository.save(otp);
            throw new OtpException("Maximum OTP attempts exceeded. Please request a new one.", "OTP_EXHAUSTED");
        }

        if (!otp.getOtpCode().equals(code)) {
            otp.setAttempts(otp.getAttempts() + 1);
            if (otp.getAttempts() >= 3) {
                otp.setUsed(true); // Invalidate immediately
            }
            otpRepository.save(otp);
            throw new OtpException("Invalid OTP code.", "OTP_INVALID");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        if ("SIGNUP".equals(otpType)) {
            user.setVerified(true);
            userRepository.save(user);
        }
    }

    @Transactional
    public void resendOtp(User user, String otpType) {
        // Rate-limit: check if an OTP was sent in last 60 seconds
        // For simplicity we just resend
        sendOtp(user, otpType);
    }

    private String generateCode() {
        int bound = (int) Math.pow(10, otpLength);
        return String.format("%0" + otpLength + "d", random.nextInt(bound));
    }

    /**
     * OTP delivery abstraction. Uses JavaMailSender to send real email if configured,
     * otherwise logs OTP code to the console for development/demo.
     */
    private void deliverOtp(String destination, String code, String otpType) {
        log.info("==========================================");
        log.info("  OTP DELIVERY [{}]", otpType);
        log.info("  To: {}", destination);
        log.info("  Code: {}", code);
        log.info("  Valid for: {} minutes", expiryMinutes);
        log.info("==========================================");

        if (mailUsername != null && !mailUsername.trim().isEmpty()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(mailFrom);
                message.setTo(destination);
                message.setSubject("Chaos Planner OTP Verification [" + otpType + "]");
                message.setText("Your Chaos Planner verification code is: " + code + 
                               "\n\nValid for: " + expiryMinutes + " minutes.");
                mailSender.send(message);
                log.info("OTP verification email sent successfully to {}", destination);
            } catch (Exception e) {
                log.error("Failed to send OTP verification email to {}: {}", destination, e.getMessage());
            }
        } else {
            log.info("SMTP username not configured. Falling back to Console Log OTP delivery.");
        }
    }
}
