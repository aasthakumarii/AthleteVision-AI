package com.athletevision.backend.controller;

import com.athletevision.backend.entity.Athlete;
import com.athletevision.backend.service.AthleteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/athletes")
public class AthleteController {

    private final AthleteService athleteService;

    public AthleteController(AthleteService athleteService) {
        this.athleteService = athleteService;
    }

    @PostMapping
    public Athlete createAthlete(@RequestBody Athlete athlete) {
        return athleteService.createAthlete(athlete);
    }

    @GetMapping
    public List<Athlete> getAllAthletes() {
        return athleteService.getAllAthletes();
    }
}