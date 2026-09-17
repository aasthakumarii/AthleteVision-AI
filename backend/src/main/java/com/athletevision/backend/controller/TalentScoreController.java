package com.athletevision.backend.controller;

import com.athletevision.backend.entity.TalentScore;
import com.athletevision.backend.repository.TalentScoreRepository;
import com.athletevision.backend.service.TalentScoreService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/talent-score")
public class TalentScoreController {

    private final TalentScoreRepository talentScoreRepository;
    private final TalentScoreService talentScoreService;

    public TalentScoreController(
            TalentScoreRepository talentScoreRepository,
            TalentScoreService talentScoreService) {

        this.talentScoreRepository = talentScoreRepository;
        this.talentScoreService = talentScoreService;
    }

    @GetMapping("/calculate")
    public double calculateScore(
            @RequestParam double speed,
            @RequestParam double agility,
            @RequestParam double ballControl,
            @RequestParam double movement) {

        return talentScoreService.calculateScore(
                speed,
                agility,
                ballControl,
                movement
        );
    }

    @PostMapping("/calculate/{videoId}")
public TalentScore calculateAndSaveScore(
        @PathVariable UUID videoId,
        @RequestParam double speed,
        @RequestParam double agility,
        @RequestParam double ballControl,
        @RequestParam double movement) {

    return talentScoreService.saveTalentScore(
            videoId,
            speed,
            agility,
            ballControl,
            movement
    );
}

    @GetMapping("/{id}")
    public TalentScore getTalentScore(@PathVariable UUID id) {
        return talentScoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Talent score not found"));
    }
}