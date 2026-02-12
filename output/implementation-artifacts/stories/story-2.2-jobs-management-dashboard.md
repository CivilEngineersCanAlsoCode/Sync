# Story 2.2: Jobs Management Dashboard

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see a list of all my saved jobs with their status,
so that I can track my tailoring progress.

## Acceptance Criteria

1. **Given** mere paas multiple saved jobs hain
2. **When** main "Jobs Dashboard" (`/jobs`) open karta hun
3. **Then** mujhe jobs ki list (Title, Company, Status, Date) dikhni chahiye.
4. **And** har entry ke saath "Edit" aur "Delete" actions hone chahiye.
5. **And** agar koi job list mein nahi hai, to "No jobs found" state dikhani chahiye with "Add Job" button.
6. **And** "Add Job" button header mein bhi accessible hona chahiye.

## Tasks / Subtasks

- [ ] **Frontend Implementation**
  - [ ] Create `/jobs` route in `frontend/src/routes/_layout/jobs/index.tsx`.
  - [ ] Implement `JobsTable` component using `DataTable` (Shadcn/UI).
  - [ ] Define columns: Title, Company, Status (Badge), Created At, Actions.
  - [ ] Connect `JobsService.readJobs` to fetch data.
  - [ ] Add "Add Job" button linking to `/jobs/add`.
- [ ] **Integration & State**
  - [ ] Ensure specific error handling for fetch failures (e.g., API down).
  - [ ] Verify Romanised Hindi text for empty states and table headers.

## Dev Notes

- **Architecture Compliance:**
  - Use `tanstack/react-table` for the data table (already installed and configured in `Commons/DataTable.tsx`).
  - Use `JobsService` generated from OpenAPI for API calls (`client` folder).
  - Ensure strict separation of concerns: Route loads data -> Passes to Component.

- **UX patterns:**
  - **Achromatic Palette:** Use clean whites/grays for table background.
  - **Status Badges:** Use Shadcn `Badge` component. Statuses: `SAVED`, `APPLIED`, `INTERVIEWING`. Map these to specific colors if defined (e.g., Saved=Gray, Applied=Blue).
  - **Empty State:** Clear call to action to "Add Job".

- **Testing Standards:**
  - E2E Test (`jobs.spec.ts`): Verify table renders with correct data after adding a job.
  - Test empty state when no jobs exist (mock response).

### Project Structure Notes

- `frontend/src/routes/_layout/jobs/index.tsx`: Main route file.
- `frontend/src/components/Jobs/columns.tsx`: Table column definitions (Title, Company, Status, Actions).
- `frontend/src/components/Jobs/JobsTable.tsx`: (Optional) Wrapper around `DataTable` if custom logic needed, or use `DataTable` directly in route.

### References

- [Epics: Story 2.2](output/planning-artifacts/epics.md#story-22-jobs-management-dashboard)
- [UX Design: Component Strategy](output/planning-artifacts/ux-design-specification.md#41-design-system-components-shadcnui)
- [Architecture: Frontend Structure](output/planning-artifacts/architecture.md#project-structure-boundaries-step-6)

## Dev Agent Record

### Agent Model Used

Antigravity (simulated)

### Completion Notes List

- Confirmed `DataTable` component exists in `frontend/src/components/Common/DataTable.tsx`.
- Confirmed `Items/columns.tsx` serves as a good reference for implementation.
