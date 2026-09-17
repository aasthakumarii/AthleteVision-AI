package com.athletevision.backend.repository;

import com.athletevision.backend.entity.PerformanceReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PerformanceReportRepository
        extends JpaRepository<PerformanceReport, UUID> {
}
