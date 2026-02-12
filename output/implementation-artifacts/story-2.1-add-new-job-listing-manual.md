# Story 2.1: Add New Job Listing (Manual)

## Story Details

**Epic:** Epic 2: Job Intelligence & Management
**Story:** 2.1
**Title:** Add New Job Listing (Manual)
**Status:** Ready for Dev
**Priority:** P0

## User Story

As a user, I want to manually input Job Title, Company Name, Job Link, and JD text, so that I can start the tailoring process for a specific role and track where I applied.

## Acceptance Criteria

- [ ] **AC-2.1-01:** **Given** main "Add Job" page par hun, **When** main Title, Company, Job Link, aur JD text submit karta hun, **Then** data Postgres database mein save hona chahiye.
- [ ] **AC-2.1-02:** **Then** page par success message Romanised Hindi mein dikhna chahiye ("Job successfully saved!").

## Technical Notes

- **Backend:** Create `POST /api/v1/jobs/` endpoint.
- **Model:** `Job` model with `title`, `company`, `jd_text`, `url` (new), `status` fields.
- **Frontend:** Create `/jobs/add` page with a form.
- **Validation:** Ensure `title`, `company`, `jd_text` are required. `url` is optional but recommended.
- **Romanised Hindi:** Comments and user-facing messages must be in Romanised Hindi.
- **Error Format:** `{ "error": "Romanised Hindi Msg", "code": "TECH_CODE" }`.

## Development Checklist

- [ ] Backend: Define `Job` SQLModel (include `url`)
- [ ] Backend: Create CRUD operations for Jobs
- [ ] Backend: Create API Endpoint `POST /jobs/`
- [ ] Frontend: Create "Add Job" Form Component (include URL input)
- [ ] Frontend: Integrate API with Form
- [ ] Verification: Add E2E test for Job Creation
