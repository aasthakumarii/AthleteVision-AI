package com.athletevision.backend.repository;

import com.athletevision.backend.entity.PerformanceMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PerformanceMetricRepository
        extends JpaRepository<PerformanceMetric, UUID> {

    List<PerformanceMetric> findByVideoId(UUID videoId);
}