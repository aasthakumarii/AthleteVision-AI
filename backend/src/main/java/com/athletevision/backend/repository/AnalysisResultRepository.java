package com.athletevision.backend.repository;

import com.athletevision.backend.entity.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, UUID> {
}