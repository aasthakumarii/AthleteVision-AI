package com.athletevision.backend.controller;

import com.athletevision.backend.entity.AnalysisResult;
import com.athletevision.backend.repository.AnalysisResultRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisResultController {

    private final AnalysisResultRepository analysisResultRepository;

    public AnalysisResultController(AnalysisResultRepository analysisResultRepository) {
        this.analysisResultRepository = analysisResultRepository;
    }

    @PostMapping
    public AnalysisResult createAnalysis(@RequestBody AnalysisResult result) {
        return analysisResultRepository.save(result);
    }

    @GetMapping
    public List<AnalysisResult> getAllAnalyses() {
        return analysisResultRepository.findAll();
    }
}