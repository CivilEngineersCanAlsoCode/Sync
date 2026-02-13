# Story 2.1: Add Job Modal & Validation

**Status**: done
**Date**: 2026-02-13

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **User**,
I want to **add a new job with all necessary details (Title, Company, URL, Location, Description) via an elegant modal**,
so that **the system can generate tailored probing questions based on accurate job context**.

## Acceptance Criteria

### 🟢 Happy Path (Success)

1. **Given** I am on the Home Dashboard, **When** I click the "Add Job" button, **Then** a modal opens with an Apple-style minimalist aesthetic (8-12px rounded corners).
2. **When** I fill in all mandatory fields (Title, Company, URL, Location, Description) with valid data, **Then** the "Save Job" button becomes enabled.
3. **When** I click "Save Job", **Then** the button shows a loading state, the job is persisted to the database with status `Draft`, the modal closes, and a "Success Blue" (#3B82F6) toast appears saying "Job successfully added!".
4. **And** the Dashboard stats and job list refresh automatically to show the new entry.

### 🔴 Sad Paths & Error Handling

5. **Validation (Empty Fields)**: If I leave any mandatory field empty and click into it then out (blur), a Romanised Hindi error message (e.g., "Ye field bharna zaroori hai") appears below the field in Coral (#E87D63).
6. **Validation (URL Format)**: If the URL field does not contain a valid URL structure (e.g., `https://...`), the "Save Job" button remains disabled and an error "Sahi URL format use karein" is shown.
7. **Backend Failure**: If the server returns a 500 error during save, the modal remains open, the button returns to interactive state, and a global error toast "Server par error aaya, please firse koshish karein" appears.

### 🟡 Edge Cases

8. **Double Submit**: Rapidly clicking "Save Job" twice does not trigger multiple API calls (Submission state management).
9. **Modal Dismissal**: Clicking outside the modal or pressing `Esc` prompts for confirmation IF any field has been touched, to prevent accidental data loss.
10. **Data Type Integrity**: If Title or Company contains > 100 characters, it should be gracefully handled via UI wrapping or a character limit (100 for Title/Company, 5000 for Description).
11. **Duplicate Prevention**: If a job with the same Title and Company already exists for the user, show a warning: "Same details wala job pehle se exists karta hai."

### 🎨 Design & Accessibility Compliance

12. **Theme**: Modal must use the Achromatic palette (Pure White/Warm White) with Deep Teal (#006666) for primary buttons and Success Blue (#3B82F6) for positive feedback. [Source: ux-design-specification.md#124]
13. **Typography**: Use Inter for form labels and inputs. [Source: ux-design-specification.md#141]
14. **Keyboard**: User must be able to `Tab` through all fields and press `Enter` to submit when valid.

## Tasks / Subtasks

- [x] **Backend: Persistence & Validation** (AC: 3, 7, 10, 11)
  - [x] Update `JobBase` and `JobCreate` in `backend/app/models.py` to enforce `Field(nullable=False)` and character limits.
  - [x] Implement a check in `backend/app/api/routes/jobs.py` (`create_job`) to detect existing Title + Company duplicates.
  - [x] Ensure `Job.status` defaults to `"Draft"` on creation. [Source: epics.md#105]
- [x] **Frontend: Component Foundation** (AC: 1, 12, 13)
  - [x] Create `AddJobModal.tsx` in `frontend/src/components/Dashboard/`.
  - [x] Use `shadcn/ui/dialog` for the modal and `shadcn/ui/form` + `zod` + `react-hook-form` for the engine.
- [x] **Frontend: Form Implementation & Validation** (AC: 2, 5, 6, 14)
  - [x] Implement Zod schema with Romanised Hindi messages. [Source: architecture.md#151]
  - [x] Add the 5 mandatory inputs with clear label hierarchy.
  - [x] Implement URL validation using `z.string().url()`.
- [x] **Frontend: Submission & Logic** (AC: 3, 4, 8, 9)
  - [x] Implement the `useMutation` hook with `jobs` query invalidation.
  - [x] Add loading state to the "Save Job" button.
  - [x] Implement "Unsaved Changes" confirmation on modal close if modal is `dirty`.
- [x] **Verification: Automated Tests**
  - [x] Write Playwright E2E test `add-job.spec.ts` covering: Empty field validation, Success flow, and Duplicate warning.

### Review Follow-ups (AI)

- [x] [AI-Review][Medium] Fix missing Romanised Hindi comments in `AddJobModal.tsx` [AddJobModal.tsx:75,87]
- [x] [AI-Review][Medium] Complete status color mapping in `_layout/index.tsx` [index.tsx:38]
- [ ] [AI-Review][Low] Improve git commit message quality for schema migrations.

## Dev Notes

- **Surgical Precision**: All inputs must be perfectly aligned with consistent 12px padding (standard Apple-style). [Source: ux-design-specification.md#93]
- **Architecture Requirement**: Har function ke neeche ek 1-line Romanised Hindi comment hona chahiye. [Source: architecture.md#141]
- **API Patterns**: Use the standard `JobsService.createJob` generated client.
- **Error Format**: Standardized JSON `{ "error": "Hindi Message", "code": "TECH_CODE" }`. [Source: architecture.md#153]

### Project Structure Notes

- Frontend: `frontend/src/components/Dashboard/AddJobModal.tsx`
- Backend: `backend/app/api/routes/jobs.py` (POST endpoint)
- Schemas: `backend/app/models.py`

### References

- [PRD Functional Requirements](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/prd.md#127)
- [UX Design Directions](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/ux-design-specification.md#159)
- [Architecture Consistency Rules](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/architecture.md#132)

## Dev Agent Record

### Agent Model Used

Antigravity (M18)

### Debug Log References

### Completion Notes List

### File List

- [NEW] `frontend/components/Dashboard/AddJobModal.tsx`: Core modal component.
- [NEW] `frontend/tests/add-job.spec.ts`: E2E test suite.
- [MODIFY] `backend/app/models.py`: Added location/description fields.
- [MODIFY] `backend/app/api/routes/jobs.py`: Duplicate check and status handling.
- [MODIFY] `frontend/src/routes/_layout/index.tsx`: Dashboard integration.
- [MODIFY] `frontend/src/routes/__root.tsx`: Toaster integration.
- [MODIFY] `backend/app/crud/__init__.py`: CRUD updates (implicit).
