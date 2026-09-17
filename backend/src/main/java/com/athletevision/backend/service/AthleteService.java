package com.athletevision.backend.service;

import com.athletevision.backend.entity.Athlete;
import com.athletevision.backend.repository.AthleteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AthleteService {

    private final AthleteRepository athleteRepository;

    public AthleteService(AthleteRepository athleteRepository) {
        this.athleteRepository = athleteRepository;
    }

    public Athlete createAthlete(Athlete athlete) {
        athlete.setCreatedAt(LocalDateTime.now());
        athlete.setUpdatedAt(LocalDateTime.now());

        return athleteRepository.save(athlete);
    }

    public List<Athlete> getAllAthletes() {
        return athleteRepository.findAll();
    }
}