# 📡 Person 1 (Frontend) — API & Integration Contract for the Team

This document outlines **all endpoints, payload structures, expected JSON responses, and database requirements** needed by the React Frontend (Person 1) to seamlessly connect with the Backend (Person 2), AI Service (Person 3), and Database (Person 4).

---

## 1. Summary for Person 2 (Spring Boot Backend — Pavi & Tanishi)

All endpoints should be prefixed with `/api`.  
Except for `/api/auth/*`, all endpoints must validate the HTTP header:
```http
Authorization: Bearer <jwt_token>
```

### 🔐 1.1 Authentication & User APIs

#### `POST /api/auth/register`
- **Request Body:**
```json
{
  "name": "Arjun Mehta",
  "email": "arjun@example.com",
  "password": "password123",
  "role": "ATHLETE" // Allowed values: "ATHLETE" | "COACH"
}
```
- **Expected Response (`201 Created` or `200 OK`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Arjun Mehta",
    "email": "arjun@example.com",
    "role": "ATHLETE"
  }
}
```

#### `POST /api/auth/login`
- **Request Body:**
```json
{
  "email": "arjun@example.com",
  "password": "password123"
}
```
- **Expected Response (`200 OK`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Arjun Mehta",
    "email": "arjun@example.com",
    "role": "ATHLETE"
  }
}
```

#### `GET /api/auth/me`
- **Expected Response (`200 OK`):**
```json
{
  "id": 1,
  "name": "Arjun Mehta",
  "email": "arjun@example.com",
  "role": "ATHLETE",
  "avatarUrl": "https://..." // optional
}
```

---

### 🏃 1.2 Athlete APIs

#### `GET /api/athletes`
- **Query Params:** `?q=arjun&sport=Football&minAge=18&maxAge=25&page=0&size=10`
- **Expected Response (`200 OK`):**
```json
{
  "content": [
    {
      "id": 1,
      "userId": 10,
      "name": "Arjun Mehta",
      "sport": "Football",
      "position": "Forward",
      "age": 22,
      "height": 178,
      "weight": 72,
      "dominantFoot": "Right",
      "club": "City FC",
      "createdAt": "2026-09-01T10:00:00Z"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "page": 0,
  "size": 10
}
```

#### `GET /api/athletes/{id}`
- **Expected Response (`200 OK`):** Single Athlete object (same structure as above + optional `bio`).

#### `GET /api/athletes/{id}/talent-score`
- **Expected Response (`200 OK`):**
```json
{
  "id": 1,
  "athleteId": 1,
  "score": 74,
  "calculatedAt": "2026-09-08T10:00:00Z",
  "breakdown": {
    "physical": 78,
    "technical": 72,
    "tactical": 68,
    "consistency": 80
  }
}
```

---

### 🎥 1.3 Video Upload & Processing APIs

#### `POST /api/videos/upload`
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `file`: Video file binary (`.mp4`, `.avi`, `.mov`)
  - `sport`: string (e.g. `"Football"`)
  - `position`: string (e.g. `"Forward"`)
  - `matchDate`: string (`"2026-09-08"`)
  - `notes`: string (optional)
- **Expected Response (`202 Accepted` or `201 Created`):**
```json
{
  "id": 101,
  "athleteId": 1,
  "filename": "match_sep_08.mp4",
  "sport": "Football",
  "uploadedAt": "2026-09-08T10:00:00Z",
  "status": "PROCESSING",
  "s3Url": "https://capstone-videos.s3.amazonaws.com/videos/101.mp4"
}
```

#### `GET /api/videos/{id}/status`
*Polled by frontend every 3 seconds until status is DONE or FAILED:*
- **Expected Response (`200 OK`):**
```json
{
  "id": 101,
  "status": "PROCESSING", // "PROCESSING" | "DONE" | "FAILED"
  "reportId": 42,         // included when status is "DONE"
  "errorMessage": null    // included when status is "FAILED"
}
```

#### `GET /api/videos`
- **Expected Response (`200 OK`):** Array of uploaded videos for currently authenticated athlete.

---

### 📊 1.4 Performance & Report APIs

#### `GET /api/reports`
- **Expected Response (`200 OK`):** Array of reports for currently authenticated athlete.
```json
[
  {
    "id": 42,
    "athleteId": 1,
    "videoId": 101,
    "videoFilename": "match_sep_08.mp4",
    "sport": "Football",
    "generatedAt": "2026-09-08T10:15:00Z",
    "aiSummary": "Strong physical performance with high speed...",
    "metrics": {
      "id": 501,
      "videoId": 101,
      "speed": 82,
      "agility": 75,
      "stamina": 80,
      "accuracy": 71,
      "power": 79,
      "positioning": 73,
      "distanceCovered": 10500,
      "topSpeedKmh": 29.4,
      "sprintCount": 14,
      "ballTouches": 48,
      "createdAt": "2026-09-08T10:15:00Z"
    },
    "talentScore": {
      "id": 1,
      "athleteId": 1,
      "score": 77,
      "calculatedAt": "2026-09-08T10:15:00Z",
      "breakdown": {
        "physical": 82,
        "technical": 75,
        "tactical": 73,
        "consistency": 78
      }
    }
  }
]
```

#### `GET /api/reports/{id}`
- **Expected Response (`200 OK`):** Detailed report object (same schema as above).

---

### 📋 1.5 Coach APIs

#### `GET /api/coach/athletes`
- Query Params: `?q=&sport=&minAge=&maxAge=&minScore=&maxScore=&page=&size=`
- Returns paginated list of athletes for coach evaluation.

#### `GET /api/coach/athletes/{id}`
- Returns full athlete profile for coach view.

#### `GET /api/coach/shortlist`
- Returns array of shortlisted Athlete objects for the logged-in coach.

#### `POST /api/coach/shortlist/{athleteId}`
- Adds athlete to the coach's shortlist (`200 OK` or `204 No Content`).

#### `DELETE /api/coach/shortlist/{athleteId}`
- Removes athlete from the coach's shortlist (`200 OK` or `204 No Content`).

#### `GET /api/coach/compare?ids=1,2,3`
- Returns comparative metrics and talent scores for the selected athlete IDs.

---

## 2. Requirements for Person 3 (AI / FastAPI / Computer Vision)

When Spring Boot triggers FastAPI with the S3 video URL, the AI pipeline should return metrics matching these keys:
```json
{
  "video_id": 101,
  "status": "COMPLETED",
  "metrics": {
    "speed": 82.0,        // 0 to 100 normalized score
    "agility": 75.0,      // 0 to 100 normalized score
    "stamina": 80.0,      // 0 to 100 normalized score
    "accuracy": 71.0,     // 0 to 100 normalized score
    "power": 79.0,        // 0 to 100 normalized score
    "positioning": 73.0,  // 0 to 100 normalized score
    "distance_covered_meters": 10500.0,
    "top_speed_kmh": 29.4,
    "sprint_count": 14,
    "ball_touches": 48
  }
}
```

---

## 3. Requirements for Person 4 (PostgreSQL Database & AWS)

Tables needed in PostgreSQL:
1. **users**: `id, name, email, password_hash, role ('ATHLETE' | 'COACH'), created_at`
2. **athletes**: `id, user_id, sport, position, age, height, weight, dominant_foot, club, bio`
3. **videos**: `id, athlete_id, filename, s3_url, status ('PROCESSING' | 'DONE' | 'FAILED'), uploaded_at`
4. **performance_metrics**: `id, video_id, speed, agility, stamina, accuracy, power, positioning, distance_covered, top_speed_kmh, sprint_count, ball_touches, created_at`
5. **talent_scores**: `id, athlete_id, score, physical_score, technical_score, tactical_score, consistency_score, calculated_at`
6. **reports**: `id, athlete_id, video_id, ai_summary, talent_score_id, metric_id, generated_at`
7. **coach_shortlists**: `coach_user_id, athlete_id, created_at`
