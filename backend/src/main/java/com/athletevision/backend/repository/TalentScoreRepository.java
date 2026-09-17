package com.athletevision.backend.repository;

import com.athletevision.backend.entity.TalentScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TalentScoreRepository
        extends JpaRepository<TalentScore, UUID> {

    Optional<TalentScore> findByVideoId(UUID videoId);
}