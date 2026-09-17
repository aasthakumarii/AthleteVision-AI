package com.athletevision.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "performance_metrics")
public class PerformanceMetric {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    @Column(name = "metric_name", nullable = false)
    private String metricName;

    @Column(name = "metric_value", nullable = false, precision = 12, scale = 4)
    private BigDecimal metricValue;

    private String unit;

    public UUID getId() {
    return id;
}

public Video getVideo() {
    return video;
}

public void setVideo(Video video) {
    this.video = video;
}

public String getMetricName() {
    return metricName;
}

public void setMetricName(String metricName) {
    this.metricName = metricName;
}

public BigDecimal getMetricValue() {
    return metricValue;
}

public void setMetricValue(BigDecimal metricValue) {
    this.metricValue = metricValue;
}

public String getUnit() {
    return unit;
}

public void setUnit(String unit) {
    this.unit = unit;
}
}