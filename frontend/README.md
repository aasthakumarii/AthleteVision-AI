# AthleteIQ – Frontend (Person 1)

React 18 + TypeScript frontend for the Athlete Performance Platform.

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Routing | React Router v6 |
| State | Zustand (auth) |
| Server State | TanStack Query v5 |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Icons | Lucide React |

---

## Getting Started

> **Prerequisite:** Node.js must be on PATH.  
> If using MSYS2 (as installed here):  
> ```powershell
> $env:PATH = "C:\msys64\ucrt64\bin;" + $env:PATH
> ```

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── api/              # Axios functions per domain
│   ├── auth.ts
│   ├── athlete.ts
│   ├── videos.ts
│   ├── reports.ts
│   └── coach.ts
├── components/
│   ├── layout/       # AppLayout (sidebar + header)
│   ├── athlete/      # TalentScoreBadge, VideoCard
│   └── coach/        # AthleteTable, ShortlistButton
├── lib/
│   └── axios.ts      # Configured axios instance
├── pages/
│   ├── auth/         # LoginPage, RegisterPage
│   ├── athlete/      # Dashboard, Upload, Reports, ReportDetail
│   └── coach/        # Dashboard, Search, Profile, Compare
├── router/           # React Router + PrivateRoute
├── store/            # Zustand auth store
└── types/            # Shared TypeScript interfaces
```

---

## Environment / Config

The dev server proxies `/api` → `http://localhost:8080` (Spring Boot backend).  
To change the backend URL, edit `vite.config.ts`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // ← change this
    changeOrigin: true,
  }
}
```

For production, set `VITE_API_URL` or configure your reverse proxy.

---

## Pages

| Route | Who sees it | Description |
|---|---|---|
| `/login` | Everyone | Login form |
| `/register` | Everyone | Registration with role selection |
| `/athlete/dashboard` | ATHLETE | Stats, recent videos, score breakdown |
| `/athlete/upload` | ATHLETE | Video upload with AI processing status |
| `/athlete/reports` | ATHLETE | All performance reports |
| `/athlete/reports/:id` | ATHLETE | Detailed report with charts + AI summary |
| `/coach/dashboard` | COACH | Coach overview, shortlist, recent activity |
| `/coach/athletes` | COACH | Athlete search + filter + shortlist |
| `/coach/athletes/:id` | COACH | Full athlete profile + AI coach evaluation |
| `/coach/compare` | COACH | Side-by-side comparison (up to 3 athletes) |

---

## API Endpoints Expected from Spring Boot (Person 2)

```
POST /api/auth/login         { email, password }
POST /api/auth/register      { name, email, password, role }
GET  /api/auth/me

GET  /api/videos             (auth: ATHLETE)
POST /api/videos/upload      multipart/form-data
GET  /api/videos/:id/status  → { status, reportId }

GET  /api/reports
GET  /api/reports/:id
GET  /api/performance-metrics/:videoId

GET  /api/athletes/:id/talent-score
PUT  /api/athletes/:id/profile

GET  /api/coach/athletes     ?q=&sport=&page=
GET  /api/coach/athletes/:id
GET  /api/coach/shortlist
POST /api/coach/shortlist/:athleteId
DELETE /api/coach/shortlist/:athleteId
GET  /api/coach/compare      ?ids=1,2,3
```

All protected endpoints expect: `Authorization: Bearer <jwt>`

---

## Mock Data

All pages include realistic mock data as `placeholderData` in React Query.  
This means the UI fully renders even without a backend — great for demo day.

---

## Notes for Other Team Members

- **Person 2 (Backend):** See API table above. JWT in `Authorization: Bearer` header.
- **Person 3 (AI):** Metric keys from FastAPI should be: `speed`, `agility`, `stamina`, `accuracy`, `power`, `positioning` (all 0–100).
- **Person 4 (DB):** TalentScore breakdown fields used: `physical`, `technical`, `tactical`, `consistency`.
