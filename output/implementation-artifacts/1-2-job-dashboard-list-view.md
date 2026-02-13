# Story 1.2: Job Dashboard & List View

**Parent Epic:** Epic 1: Job Management & Dashboard
**Status:** In Progress
**Priority:** High

## User Story

**As a** User,
**I want to** view all my tracked jobs in a dashboard,
**So that** I can see which applications are in progress or completed.

## Acceptance Criteria

- [ ] **AC1:** **Given** I have saved jobs, **When** I visit the Dashboard, **Then** I see a list of jobs with Title, Company, Link, and Status.
- [ ] **AC2:** Status badges show correct colors:
  - Draft = Gray/Neutral
  - Tailored = Blue
  - Applied = Green
- [ ] **AC3:** Clicking the Job Title redirects to the Analysis Page (e.g., `/jobs/$jobId/analysis`).
- [ ] **AC4:** Valid empty state if no jobs exist.

## Technical Implementation Tasks

### Backend

- [x] **Task 1:** Verify `GET /jobs` endpoint (Already exists, verify fields).
  - Ensure `JobPublic` includes `title`, `company`, `url`, `status`, `created_at`.
  - Verify pagination (skip/limit) if needed (default 100 is fine for now).

### Frontend

- [ ] **Task 2:** Create/Update `Dashboard` Component.
  - Path: `frontend/src/routes/_layout/index.tsx` (or where the dashboard lives).
  - [x] Task 1: Backend Verification (GET /jobs)
  - [x] Task 2: Frontend Dashboard Component
  - [x] Task 3: Status Badge Logic
  - [x] Task 4: Navigation Logic (Placeholder)mpany, Link (clickable icon), Status, Date.
- [ ] **Task 3:** Implement Status Badge Logic.
  - Component: `JobStatusBadge`.
  - Map status strings to colors.
- [ ] **Task 4:** Implement Navigation.
  - Make Title clickable -> Link to `/jobs/$jobId/analysis`.
  - Note: The Analysis page might not exist yet, so create a placeholder route if needed or link to a dummy page.

## Verification Plan

### Automated Tests

- [ ] Backend: `pytest` for `GET /jobs` (already exists, double check).
- [ ] Frontend: Playwright test to verify table rendering and data presence.

### Manual Verification

1. Create a few jobs (Draft).
2. Manually update one to 'Applied' (via DB or API) to test badge colors.
3. Verify the table lists all jobs.
4. Verify empty state.
