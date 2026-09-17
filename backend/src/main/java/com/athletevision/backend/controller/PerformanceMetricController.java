package com.athletevision.backend.controller;

import com.athletevision.backend.entity.PerformanceMetric;
import com.athletevision.backend.repository.PerformanceMetricRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/metrics")
public class PerformanceMetricController {

    private final PerformanceMetricRepository metricRepository;

    public PerformanceMetricController(PerformanceMetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    @GetMapping("/video/{videoId}")
    public List<PerformanceMetric> getMetricsByVideo(@PathVariable UUID videoId) {
       return metricRepository.findByVideoId(videoId);
    }
}