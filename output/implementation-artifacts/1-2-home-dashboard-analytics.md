# Story 1.2: Home Dashboard Analytics

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see a breakdown of my jobs by status on the Home Dashboard,
so that I know where I stand in my job search at a glance.

## Acceptance Criteria

### AC1: Happy Path - Dashboard Analytics Display

**Given** I am a logged-in user with existing jobs
**When** I visit the Home Dashboard (`/`)
**Then** I see a "Job Pipeline" section
**And** I see analytics cards for each of the following statuses with their correct counts:

- Draft
- Applied
- Shortlisted
- Interviewing
- Waiting for result
- Offered
- Redirected (Important: Must use "Redirected", NOT "Rejected")
  **And** the counts match the data in the database for my user only

### AC2: Happy Path - Zero State (New User)

**Given** I am a new user with NO jobs created yet
**When** I visit the Home Dashboard
**Then** I see the analytics cards for all statuses
**And** all counts allow show "0"
**And** I see a prominent "Add Job" button or Call-to-Action to get started

### AC3: Error Path - API Failure

**Given** I am on the dashboard
**When** the analytics API request fails (e.g., 500 error or network connectivity issue)
**Then** I see an error message in the analytics section: "Stats load nahi ho paye" (Romanised Hindi)
**And** the specific error cards show a placeholder or error state (not infinite loading)
**And** I see a "Retry" button to attempt fetching the data again

### AC4: UX - Loading State

**Given** I navigate to the dashboard
**When** the analytics data is being fetched from the server
**Then** I see skeleton loaders for the analytics cards
**And** the layout is stable (no cumulative layout shift)
**And** the interactive elements (like "Add Job") are visible immediately if possible

### AC5: Security - Data Isolation

**Given** I am logged in as User A
**And** User B has 50 jobs in the system
**And** I have 0 jobs
**When** I view the dashboard
**Then** I see "0" for all counts (User B's data is strictly isolated)
**And** I cannot access User B's stats via API manipulation

### AC6: Edge Case - High Counts

**Given** I have a large number of jobs (e.g., 1000+) in a single status
**When** I view the dashboard
**Then** the count is displayed correctly without breaking the UI layout
**And** the card/font scales or truncates appropriately (e.g., 1.2k) if necessary to fit design

### AC7: Design Compliance - Visual Style

**Given** the analytics cards are rendered
**Then** they follow the "Surgical Achromatic" design system (White/Teal theme)
**And** the "Redirected" status uses the defined color/icon (e.g., Gray/Neutral, distinguishing it from active statuses)
**And** the "Offered" status uses the "Success Blue" or "Golden" accent as per UX specs

## Tasks / Subtasks

- [ ] **Task 1: Backend - Analytics Endpoint** (AC: #1, #2, #5)
  - [ ] Create `JobStats` Pydantic model (fields for each status count)
  - [ ] Implement `GET /jobs/stats` endpoint in `backend/app/api/routes/jobs.py`
  - [ ] Write optimized SQL query using `GROUP BY status` for performance
  - [ ] Ensure `owner_id` filter is applied for strict data isolation

- [ ] **Task 2: Frontend - Analytics UI Components** (AC: #1, #2, #4, #6, #7)
  - [ ] Create `JobStatsCard` component (Shadcn Card + Tailwind)
  - [ ] Create `JobStatsGrid` component for layout
  - [ ] Implement Skeleton loader state for cards
  - [ ] Apply "Surgical Achromatic" styling (Teal accents)

- [ ] **Task 3: Frontend - Data Integration** (AC: #1, #3)
  - [ ] Add `getJobStats` function to `frontend/src/client` (or generate via OpenAPI)
  - [ ] Create `useJobStats` hook using TanStack Query
  - [ ] Handle `isLoading` and `isError` states
  - [ ] Implement "Retry" mechanism for failed requests

- [x] **Task 4: Testing - Backend & Frontend** (AC: All)
  - [x] **Backend Unit Tests**:
    - [x] Test `get_job_status_counts` with 0 jobs
    - [x] Test `get_job_status_counts` with mixed statuses
    - [x] Test data isolation (User A vs User B)
  - [x] **Frontend Unit Tests**:
    - [x] Test `JobStatsGrid` renders all cards
    - [x] Test "Redirected" label is present
    - [x] Test loading state (skeletons)
    - [x] Test error state and retry button
  - [x] **E2E Tests**:
    - [x] Complete flow: Login -> Create Jobs (via API/seed) -> Verify Dashboard Counts
    - [x] Verify 0 counts for new user

- [x] **Review Follow-ups (AI)**
  - [x] [AI-Review][High] Implement prominent "Add Job" button on Dashboard (AC2)
  - [x] [AI-Review][High] Rename `Rejected` to `Redirected` in backend models and API (AC1/AC7)
  - [x] [AI-Review][High] Implement scaling/truncation logic for high counts (AC6)
  - [x] [AI-Review][Medium] Fix "Waiting" label to "Waiting for result" (AC1)
  - [x] [AI-Review][Medium] Update documentation to reflect correct file paths (sdk.gen.ts)

## Dev Notes

### Architecture Compliance

- **Endpoint:** `GET /jobs/stats` (New endpoint following REST patterns)
- **Response Model:** `JobStats` (Pydantic)
- **Design System:** Use existing Shadcn `Card` component. Colors:
  - Active statuses (Applied, Interviewing): Teal/Primary
  - Neutral (Draft, Waiting): Gray/Secondary
  - Success (Offered): Blue/Gold
  - Redirected: Muted Gray

### File Structure

- **Backend:** `backend/app/api/routes/jobs.py` (Add endpoint here)
- **Backend Tests:** `backend/tests/api/routes/test_jobs.py` (Add stats tests)
- **Frontend Components:** `frontend/src/components/Dashboard/JobStats.tsx` (New component)
- **Frontend Hooks:** `frontend/src/hooks/useJobs.ts` (Add useJobStats)

### Performance

- Use `GROUP BY` in SQL instead of fetching all jobs and counting in Python.
- Pydantic model should be lightweight.

### References

- [Source: output/planning-artifacts/ux-design-specification.md#Visual Design Foundation]
- [Source: backend/app/api/routes/jobs.py]
- [Source: output/planning-artifacts/epics.md#Story 1.2]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash Thinking Experimental (02-13-2026)

### Completion Notes List

- Comprehensive ACs covering happy, sad, and edge cases.
- "Redirected" vs "Rejected" explicitly handled.
- Security/Data isolation emphasized.
- Loading/Error states included for UX.
