package com.athletevision.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "performance_reports")
public class PerformanceReport {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne
    @JoinColumn(name = "video_id", nullable = false, unique = true)
    private Video video;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private String strengths = "[]";
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private String weaknesses = "[]";
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private String recommendations = "[]";
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metrics_summary", nullable = false, columnDefinition = "jsonb")
    private String metricsSummary = "{}";

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "generated_at", nullable = false)
    private OffsetDateTime generatedAt = OffsetDateTime.now();

    // Getters and Setters
}
