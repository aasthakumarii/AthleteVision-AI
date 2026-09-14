-- ============================================================
-- AthleteVision AI
-- PostgreSQL Database Schema
-- MVP Version
-- ============================================================

-- Optional: UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('ATHLETE', 'COACH', 'SCOUT', 'ADMIN')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. ATHLETES
-- ============================================================

CREATE TABLE athletes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    sport VARCHAR(100) NOT NULL,

    position VARCHAR(100),

    location VARCHAR(255),

    bio TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_athlete_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. VIDEOS
-- ============================================================

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    athlete_id UUID NOT NULL,

    filename VARCHAR(255) NOT NULL,

    s3_key TEXT NOT NULL UNIQUE,

    video_url TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'UPLOADED'
        CHECK (
            status IN (
                'UPLOADED',
                'PROCESSING',
                'COMPLETED',
                'FAILED'
            )
        ),

    duration_seconds NUMERIC(10, 2),

    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    processed_at TIMESTAMPTZ,

    CONSTRAINT fk_video_athlete
        FOREIGN KEY (athlete_id)
        REFERENCES athletes(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_video_duration
        CHECK (
            duration_seconds IS NULL
            OR duration_seconds >= 0
        )
);


-- ============================================================
-- 4. PERFORMANCE METRICS
-- ============================================================
--
-- AI service can return different metrics without requiring
-- database schema changes.
--
-- Example:
--   metric_name  = 'max_speed'
--   metric_value = 24.5
--   unit         = 'km/h'
--
-- Multiple metrics can belong to one video.
-- ============================================================

CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    video_id UUID NOT NULL,

    metric_name VARCHAR(100) NOT NULL,

    metric_value NUMERIC(12, 4) NOT NULL,

    unit VARCHAR(50),

    CONSTRAINT fk_metric_video
        FOREIGN KEY (video_id)
        REFERENCES videos(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 5. TALENT SCORES
-- ============================================================
--
-- Score range: 0 - 100
--
-- MVP weights:
--   Speed                  = 30%
--   Agility                = 25%
--   Ball/Skill Control     = 25%
--   Movement/Positioning   = 20%
--
-- score_breakdown stores the individual category scores
-- and weights as JSONB.
--
-- Example:
--
-- {
--   "speed": {
--      "score": 82,
--      "weight": 0.30
--   },
--   "agility": {
--      "score": 75,
--      "weight": 0.25
--   },
--   "ball_control": {
--      "score": 90,
--      "weight": 0.25
--   },
--   "movement_positioning": {
--      "score": 70,
--      "weight": 0.20
--   }
-- }
--
-- One video has one current talent score for the MVP.
-- Version allows the scoring algorithm to evolve.
-- ============================================================

CREATE TABLE talent_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    video_id UUID NOT NULL UNIQUE,

    score NUMERIC(5, 2) NOT NULL,

    version VARCHAR(50) NOT NULL DEFAULT 'v1',

    score_breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_talent_score_video
        FOREIGN KEY (video_id)
        REFERENCES videos(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_talent_score_range
        CHECK (
            score >= 0
            AND score <= 100
        )
);


-- ============================================================
-- 6. PERFORMANCE REPORTS
-- ============================================================
--
-- Generated using Gemini/OpenAI.
--
-- JSONB fields allow multiple strengths, weaknesses,
-- recommendations, and flexible metric summaries.
--
-- Example strengths:
-- [
--   "Good acceleration",
--   "Strong ball control"
-- ]
--
-- Example recommendations:
-- [
--   "Practice lateral movement drills",
--   "Improve first-touch control"
-- ]
-- ============================================================

CREATE TABLE performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    video_id UUID NOT NULL UNIQUE,

    summary TEXT NOT NULL,

    strengths JSONB NOT NULL DEFAULT '[]'::JSONB,

    weaknesses JSONB NOT NULL DEFAULT '[]'::JSONB,

    recommendations JSONB NOT NULL DEFAULT '[]'::JSONB,

    metrics_summary JSONB NOT NULL DEFAULT '{}'::JSONB,

    model_version VARCHAR(100),

    generated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_performance_report_video
        FOREIGN KEY (video_id)
        REFERENCES videos(id)
        ON DELETE CASCADE
);


-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_role
    ON users(role);


-- Athletes
CREATE INDEX idx_athletes_sport
    ON athletes(sport);

CREATE INDEX idx_athletes_location
    ON athletes(location);


-- Videos
CREATE INDEX idx_videos_athlete_id
    ON videos(athlete_id);

CREATE INDEX idx_videos_status
    ON videos(status);

CREATE INDEX idx_videos_uploaded_at
    ON videos(uploaded_at);


-- Performance Metrics
CREATE INDEX idx_performance_metrics_video_id
    ON performance_metrics(video_id);

CREATE INDEX idx_performance_metrics_name
    ON performance_metrics(metric_name);


-- Talent Scores
CREATE INDEX idx_talent_scores_score
    ON talent_scores(score);


-- Performance Reports
CREATE INDEX idx_performance_reports_video_id
    ON performance_reports(video_id);


-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
--
-- Automatically updates updated_at whenever a row is modified.
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_athletes_updated_at
BEFORE UPDATE ON athletes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- END OF SCHEMA
-- ============================================================
