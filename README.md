# TalentBridge ATS — Frontend

TalentBridge is an Applicant Tracking System (ATS) that connects **candidates** looking for jobs with **recruiters** managing a hiring pipeline. This repository contains the React frontend — a single-page app served as static files and backed by a separate Spring Boot API.

**Live app:** [https://application-tracking-system-fronten.vercel.app](https://application-tracking-system-fronten.vercel.app)
**Backend API:** [https://applicationtrackingsystem-backend-production.up.railway.app](https://applicationtrackingsystem-backend-production.up.railway.app)
**API docs (Swagger):** `/swagger-ui.html` on the backend URL above

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| HTTP client | Axios |
| Auth | JWT (stored in `localStorage`, attached via Axios interceptor) |
| Linting | ESLint |
| Hosting | Vercel |

---

## Features

### Public
- Landing page with product overview
- Login (candidates and recruiters share the same login form)
- Registration — **candidates only**; recruiter accounts are provisioned directly on the backend and cannot self-register

### Candidate
- Browse and search open job listings
- View full job details
- Apply to a job with an optional cover note and resume link
- Track submitted applications and their pipeline status (Applied → Under Review → Shortlisted → Interview → Offer → Hired/Rejected/Withdrawn)
- Withdraw an application

### Recruiter
- Dashboard with an overview of jobs and pipeline activity
- Create, edit, and manage job postings
- View applicants for a specific job
- Review an applicant's full profile: cover note, resume link, rating, and notes
- Move an applicant through the hiring pipeline
- Add internal notes and a rating to an applicant

---

## Project Structure

```
src/
├── api/            # Axios client + one file per API resource (auth, jobs, applications)
├── auth/           # AuthContext — current user, login/logout, token persistence
├── components/
│   ├── layout/     # Navbar, Footer, Layout wrapper
│   └── ui/         # Reusable UI primitives (Button, Card, Badge, Input, etc.)
├── pages/
│   ├── candidate/  # Jobs listing, job detail, my applications
│   └── recruiter/  # Dashboard, job management, applicant review
├── routes/         # Route guards (PrivateRoute, RecruiterRoute, CandidateRoute)
├── utils/          # Shared constants (pipeline stages, status labels)
├── App.jsx         # Route definitions
└── index.css       # Design tokens (brand colors, fonts) + Tailwind entry point
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- A running instance of the [TalentBridge backend](https://applicationtrackingsystem-backend-production.up.railway.app) (local or deployed)

### Setup

```bash
git clone <this-repo-url>
cd talentbridge-frontend
npm install
```

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8080
```

(Point this at your local backend, or at the deployed Railway URL if you don't want to run the backend locally.)

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server with hot reload |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally, for a final check before deploying |
| `npm run lint` | Run ESLint across the project |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API. No trailing slash. | `https://applicationtrackingsystem-backend-production.up.railway.app` |

Vite only reads variables prefixed with `VITE_`, and it bakes them into the build at **build time** — so this must be set correctly before running `npm run build`, not just at runtime.

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel, import the repo (Vite is auto-detected).
3. Under **Settings → Environment Variables**, add `VITE_API_BASE_URL` pointing at the deployed backend.
4. Deploy. Every push to the connected branch triggers a new deployment automatically.

**Note:** if you change `VITE_API_BASE_URL` after the project already has a deployment, you must trigger a **redeploy** — Vercel does not rebuild automatically just because a variable changed.

---

## Backend Integration

This frontend expects a REST API exposing (non-exhaustive):

- `POST /api/auth/login`, `POST /api/auth/register`
- `GET /api/jobs`, `GET /api/jobs/{id}`, `POST/PUT/DELETE /api/jobs/**` *(recruiter only)*
- `POST /api/applications`, `GET /api/applications/me`, `DELETE /api/applications/{id}`
- `GET /api/applications/job/{jobId}`, `PATCH /api/applications/{id}/status`, `PATCH /api/applications/{id}/rating`, `POST /api/applications/{id}/notes` *(recruiter only)*

Authentication is JWT-based: the token returned on login is stored in `localStorage` and attached to every request as an `Authorization: Bearer <token>` header. A `401` response clears the session and redirects to `/login`; a `403` redirects to `/unauthorized`.

Full API documentation is available on the backend's Swagger UI at `/swagger-ui.html`.


