# Story 5.1: Code Organization & Cleanup

Status: ready-for-dev

## Story

As a Developer,
I want to organize code files and folders and remove unused artifacts,
So that the codebase remains maintainable and easy to navigate for Release 2.

## Acceptance Criteria

1. **Given** the current codebase state after Release 1
2. **When** I review the file structure
3. **Then** files are grouped logically (e.g., domain-based or layer-based)
4. **And** any unused files or temporary scripts are removed
5. **And** naming conventions are consistent across backend and frontend
6. **And** the application still runs correctly after reorganization

## Tasks / Subtasks

- [ ] Task 1: Analyze and Clean Backend Structure
  - [ ] Review `backend/app` against Architecture "Project Structure" (Step 6).
  - [ ] Ensure all routes are in `backend/app/api/routes`.
  - [ ] Ensure all models are in `backend/app/models`.
  - [ ] Remove any root-level temp files or scripts not in `scripts/`.
- [ ] Task 2: Analyze and Clean Frontend Structure
  - [ ] Review `frontend/src` structure.
  - [ ] Group components logically (e.g., `components/Jobs`, `components/Shared`).
  - [ ] Verify `routes` folder matches Route Tree.
  - [ ] Remove unused components or test files.
- [ ] Task 3: Standardization & Naming
  - [ ] Enforce `snake_case` for Python files/functions.
  - [ ] Enforce `camelCase` for TS/React files/functions.
  - [ ] **Critical:** Ensure "Romanised Hindi" comments are preserved in all moved files.
- [ ] Task 4: verification
  - [ ] Run backend and frontend locally to ensure no import errors.
  - [ ] Verify Docker build succeeds.

## Dev Notes

### Architecture Alignment

- **Structure:** Follow the structure defined in `architecture.md` (Step 6).
- **Backend:** `backend/app/api`, `backend/app/services`, `backend/app/models`.
- **Frontend:** `frontend/src/components`, `frontend/src/pages` (or `routes` for TanStack Router).

### Project Structure Notes

- **Current State:** Release 1 code is likely flat or loosely organized.
- **Goal:** Strict adherence to the `sync-project` structure defined in architecture.

### References

- [Architecture Document](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/architecture.md)
- [Epics Document](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/epics.md)

## Dev Agent Record

### Agent Model Used

- Antigravity (Google DeepMind)

### Debug Log References

- N/A
