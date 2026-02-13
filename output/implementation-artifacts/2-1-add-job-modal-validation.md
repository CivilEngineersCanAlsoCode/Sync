# Story 2.1: Add Job Modal & Validation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to add a new job with all necessary details (Title, Company, URL, Location, Description),
so that the AI has enough information to generate questions.

## Acceptance Criteria

1. **Given** I click "Add Job" (on the Home Dashboard)
2. **When** the modal opens
3. **Then** I see mandatory fields: Title, Company, URL, Location, Description
4. **And** the "Save Job" button is disabled until all fields have valid input
5. **And** clicking "Save Job" creates the job in the database and closes the modal

## Tasks / Subtasks

- [ ] **Backend**: Enhance Job Model & Schema (AC: 5)
  - [ ] Update `JobBase` in `models.py` to ensure all fields (title, company, url, location, description) are present and validated.
  - [ ] Verify `JobCreate` schema matches backend expectations.
- [ ] **Frontend**: Implement Add Job Modal (AC: 1, 2, 3)
  - [ ] Create `AddJobModal` component using `shadcn/ui/dialog`.
  - [ ] Build form using `react-hook-form` and `zod` for validation.
  - [ ] Add Form fields for: Title, Company, URL, Location, Description.
- [ ] **Frontend**: Validation & Interactivity (AC: 4)
  - [ ] Disable "Save Job" button if form is invalid/incomplete.
  - [ ] show loading state during submission.
- [ ] **Frontend**: Integration with Dashboard (AC: 5)
  - [ ] Trigger `AddJobModal` from the "Add Job" button on the Dashboard.
  - [ ] Perform mutation and invalidate `jobs` query on success.
  - [ ] Show "Job successfully added!" toast notification.
- [ ] **Verification**: E2E Tests
  - [ ] Add Playwright test to verify modal opening, validation logic, and successful job creation.

## Dev Notes

- **Architecture Compliance**:
  - Use `SQLModel` for backend operations. [Source: architecture.md#115]
  - Use `shadcn/ui` and `React` for the frontend modal. [Source: architecture.md#84]
  - **MANDATORY**: Har function ke neeche ek 1-line Romanised Hindi comment hona chahiye. [Source: architecture.md#139]
- **API Patterns**: Use the existing `POST /api/v1/jobs/` endpoint.
- **Error Handling**: Use Romanised Hindi for validation messages (e.g., "Sabhi fields bharna zaroori hai"). [Source: architecture.md#151]

### Project Structure Notes

- Frontend component should reside in `frontend/src/components/Dashboard/AddJobModal.tsx`.
- Backend routes are already in `backend/app/api/routes/jobs.py`.

### References

- [Epic Breakdown](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/epics.md#L83)
- [Architecture Decisions](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/architecture.md)

## Dev Agent Record

### Agent Model Used

Antigravity (M18)

### Debug Log References

### Completion Notes List

### File List
