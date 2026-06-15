package com.chaosplanner.config;

import com.chaosplanner.entity.Role;
import com.chaosplanner.entity.User;
import com.chaosplanner.repository.RoleRepository;
import com.chaosplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Checking database for default roles and admin account...");

        // Seed Roles
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
            log.info("Creating ROLE_USER...");
            Role r = new Role();
            r.setName("ROLE_USER");
            return roleRepository.save(r);
        });

        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
            log.info("Creating ROLE_ADMIN...");
            Role r = new Role();
            r.setName("ROLE_ADMIN");
            return roleRepository.save(r);
        });

        Role subAdminRole = roleRepository.findByName("ROLE_SUB_ADMIN").orElseGet(() -> {
            log.info("Creating ROLE_SUB_ADMIN...");
            Role r = new Role();
            r.setName("ROLE_SUB_ADMIN");
            return roleRepository.save(r);
        });

        // Seed Admin User
        if (!userRepository.existsByEmail("admin@chaos.dev")) {
            log.info("Creating default admin account (admin@chaos.dev)...");
            User admin = new User();
            admin.setFullName("Super Admin");
            admin.setEmail("admin@chaos.dev");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setVerified(true);
            admin.getRoles().add(adminRole);
            admin.getRoles().add(userRole);
            userRepository.save(admin);
            log.info("Default admin created successfully!");
        }
    }
}
