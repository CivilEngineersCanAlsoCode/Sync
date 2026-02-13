# Story 1.1: Create Job Entry (Draft)

Status: ready-for-dev

## Story

As a User,
I want to create a new job entry with Title, Company, Link, and JD,
So that I can start the tailoring process for a specific application.

## Acceptance Criteria

1. **Given** I am on the Jobs Dashboard
2. **When** I click "Add Job" and enter Title, Company, Link, and JD
3. **Then** the job is saved with status "Draft"
4. **And** I am redirected to the Dashboard where the new job appears

## Tasks / Subtasks

- [x] Task 1: Backend - Job Model Update
  - [x] Verify `Job` model has `title`, `company`, `link`, `description` (JD), and `status`.
  - [x] Ensure `status` defaults to "Draft".
  - [x] Update `JobCreate` and `JobUpdate` schemas if fields are missing.
  - [x] Create migration/update DB schema if needed (or minimal sync).
- [x] Task 2: Backend - Create Job Endpoint
  - [x] Verify `POST /jobs` handles the new fields correctly.
  - [x] Add unit tests for creating a job with all fields.
- [x] Task 3: Frontend - Add Job UI
  - [x] Create/Update "Add Job" button on Dashboard.
  - [x] Create "Add Job" Form (Modal or Page) with fields: Title, Company, Link, Job Description (TextArea).
  - [x] Implement validation (required fields).
- [x] Task 4: Frontend - Integration
  - [x] Integrate Form with `POST /jobs` API.
  - [x] Handle success (redirect/refresh) and error states.
- [x] Task 5: Verification
  - [x] Verify full flow: Click Add -> Fill -> Save -> See in List.

## Dev Notes

### Architecture Alignment

- **Backend:** `Job` model in `models.py`. Routes in `api/routes/jobs.py`.
- **Frontend:** Components in `components/Jobs`.

### Previous Implementation

- Basic `Job` model exists. Need to confirm `description` and `link` fields.
- `POST /jobs` exists but might need schema updates.

### References

- [Epics Document](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/epics.md)
