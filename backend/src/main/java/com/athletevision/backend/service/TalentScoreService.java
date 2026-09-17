package com.athletevision.backend.service;

import com.athletevision.backend.entity.TalentScore;
import com.athletevision.backend.entity.Video;
import com.athletevision.backend.repository.TalentScoreRepository;
import com.athletevision.backend.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class TalentScoreService {

    private final TalentScoreRepository talentScoreRepository;
    private final VideoRepository videoRepository;

    public TalentScoreService(
            TalentScoreRepository talentScoreRepository,
            VideoRepository videoRepository) {

        this.talentScoreRepository = talentScoreRepository;
        this.videoRepository = videoRepository;
    }

    public double calculateScore(
            double speed,
            double agility,
            double ballControl,
            double movement) {

        return (speed * 0.30)
                + (agility * 0.25)
                + (ballControl * 0.25)
                + (movement * 0.20);
    }

    public TalentScore saveTalentScore(
            UUID videoId,
            double speed,
            double agility,
            double ballControl,
            double movement) {

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        double calculatedScore = calculateScore(
                speed,
                agility,
                ballControl,
                movement
        );

        TalentScore talentScore = new TalentScore();

        talentScore.setVideo(video);
        talentScore.setScore(BigDecimal.valueOf(calculatedScore));

        return talentScoreRepository.save(talentScore);
    }
}