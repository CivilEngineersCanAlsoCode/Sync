# Story 2.3: Delete or Archive Job

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to delete jobs that are no longer relevant,
so that my dashboard stays clean.

## Acceptance Criteria

1. **Given** dashboard par job list visible hai
2. **When** main kisi job par "Delete" click karta hun
3. **Then** wo record database se remove hona chahiye.
4. **And** error hone par format `{ "error": "Job delete nahi ho payi", "code": "DELETE_ERROR" }` hona chahiye.

## Tasks / Subtasks

- [ ] **Frontend Implementation**
  - [ ] Update `JobsService` client if needed (DELETE endpoint should already be generated).
  - [ ] Implement `handleDelete` function in `frontend/src/routes/_layout/jobs/index.tsx` (or passed to columns).
  - [ ] Wire up "Delete" action in `frontend/src/components/Jobs/columns.tsx`.
  - [ ] Add confirmation dialog (Shadcn `AlertDialog`) before deletion.
  - [ ] Refresh job list after successful deletion.
- [ ] **Integration**
  - [ ] Verify API call to `DELETE /api/v1/jobs/{id}`.
  - [ ] Handle error states (show Toast).

## Dev Notes

- **Architecture Compliance:**
  - Use `JobsService.deleteJob` (OpenAPI generated).
  - Use `useMutation` from `tanstack/react-query` for optimistic updates or invalidation.
  - Invalidate `['jobs']` query key on success.

- **UX patterns:**
  - **Destructive Action:** Delete button should be red/destructive in dropdown or have a warning icon.
  - **Confirmation:** MUST ask "Are you sure?" to prevent accidental data loss. Use `AlertDialog`.
  - **Feedback:** Success Toast: "Job deleted successfully" (Romanised Hindi: "Job delete ho gayi").

- **Testing Standards:**
  - E2E Test (`jobs.spec.ts`):
    - Create a job.
    - Click delete.
    - Confirm dialog.
    - Verify job is gone from list.

### Project Structure Notes

- `frontend/src/components/Jobs/columns.tsx`: Needs update to handle delete action (maybe pass a handler or use a context/hook).
- `frontend/src/routes/_layout/jobs/index.tsx`: Best place to hold the mutation logic and query invalidation.

### References

- [Epics: Story 2.3](output/planning-artifacts/epics.md#story-23-delete-or-archive-job)
- [UX Design: Feedback Patterns](output/planning-artifacts/ux-design-specification.md#52-feedback-patterns-the-surgical-signal-system)

## Dev Agent Record

### Agent Model Used

Antigravity (simulated)

### Completion Notes List

- Check if `AlertDialog` component is installed in `frontend/src/components/ui/alert-dialog.tsx`. If not, might need to install/add it.
