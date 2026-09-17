package com.athletevision.backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "analysis_results")
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    private Double speed;
    private Double agility;
    private Double ballControl;
    private Double talentScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public Double getAgility() {
        return agility;
    }

    public void setAgility(Double agility) {
        this.agility = agility;
    }

    public Double getBallControl() {
        return ballControl;
    }

    public void setBallControl(Double ballControl) {
        this.ballControl = ballControl;
    }

    public Double getTalentScore() {
        return talentScore;
    }

    public void setTalentScore(Double talentScore) {
        this.talentScore = talentScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}