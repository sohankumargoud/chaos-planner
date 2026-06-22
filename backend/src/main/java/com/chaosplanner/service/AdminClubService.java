package com.chaosplanner.service;

import com.chaosplanner.dto.club.ClubResponse;
import com.chaosplanner.dto.club.CreateClubRequest;
import com.chaosplanner.entity.Club;
import com.chaosplanner.entity.User;
import com.chaosplanner.exception.ApiException;
import com.chaosplanner.repository.ClubRepository;
import com.chaosplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminClubService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    @Transactional
    public ClubResponse createClub(CreateClubRequest request, String adminEmail) {
        if (clubRepository.existsByName(request.getName())) {
            throw new ApiException("Club name already exists", HttpStatus.CONFLICT, "CLUB_NAME_EXISTS");
        }

        User admin = userRepository.findByEmail(adminEmail).orElseThrow();

        Club club = new Club();
        club.setName(request.getName());
        club.setDescription(request.getDescription());
        club.setLogoUrl(request.getLogoUrl());

        Club savedClub = clubRepository.save(club);
        
        admin.getClubs().add(savedClub);
        userRepository.save(admin);

        return toResponse(savedClub);
    }

    public List<ClubResponse> listMyClubs(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail).orElseThrow();
        return admin.getClubs().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ClubResponse toResponse(Club club) {
        ClubResponse response = new ClubResponse();
        response.setId(club.getId());
        response.setName(club.getName());
        response.setDescription(club.getDescription());
        response.setLogoUrl(club.getLogoUrl());
        response.setCreatedAt(club.getCreatedAt());
        return response;
    }
}
