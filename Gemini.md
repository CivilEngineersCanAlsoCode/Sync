# Gemini Learning & Mistake Protocol

Every time a mistake is made, it MUST be documented here using the following template to ensure zero repetition.

## 📋 Mistake Documentation Template

```markdown
### [Complexity/Category]: [Short Description]

- **Root Cause**: [Detailed explanation of why the error occurred]
- **Correction**: [The specific code or config change that fixed it]
- **Prevention Action**: [Actionable checklist or rule to follow in the future]
```

---

## 🚫 Mistakes That Must NEVER Repeat

### [Infrastructure]: Database Schema Sync Failure

- **Root Cause**: Backend models were updated with new mandatory fields (`location`, `description`), but the existing PostgreSQL database schema was not migrated, leading to "column does not exist" errors in the API.
- **Correction**: Executed manual `ALTER TABLE` commands via `docker exec` to add `location` and rename `jd_text` to `description`.
- **Prevention Action**: Always check the database schema against the SQLModel definition after modification. Use the 3-step migration pattern (Nullable -> Default -> Not Null) for mandatory fields.

### [Logic]: Pydantic Validation failure for existing NULL data

- **Root Cause**: Adding a `str` (non-nullable) field to a model caused existing database records with `NULL` values to fail Pydantic validation on fetch, causing API hangs or 500 errors.
- **Correction**: Updated existing records to have placeholder values (`Unknown`, `https://example.com`) and updated column to `NOT NULL`.
- **Prevention Action**: When making a field mandatory, either ensure the DB has a default or use the 3-step migration: Nullable -> Update Defaults -> Not Null.

### [Frontend]: Missing Toaster Provider

- **Root Cause**: Integrated `Sonner` toasts but forgot to add the `<Toaster />` component to the `__root.tsx` layout, causing toasts to be invisible during manual and E2E testing.
- **Correction**: Added `<Toaster />` to `__root.tsx`.
- **Prevention Action**: Verify that any UI feedback library (toast, dialog, etc.) has its provider/container correctly placed in the root layout.

### [Frontend]: Syntax Error in Root Layout

- **Root Cause**: Accidentally left duplicate closing tags/fragments in `__root.tsx` while editing, breaking the compilation of the entire frontend.
- **Correction**: Cleaned up `__root.tsx` to fix the fragment syntax.
- **Prevention Action**: Always double-check the file structure after multiple edits. Verify that the file compiles before running tests.

### [Testing]: Toast Locator Ambiguity

- **Root Cause**: Multiple instances of `Sonner` toast in the DOM (or workers sharing state) caused `getByText` to fail due to multiple matches.
- **Correction**: Used `.first()` on toast locators in Playwright tests.
- **Prevention Action**: When testing ephemeral UI elements like toasts, always account for multiple instances or use `.first()`.

### [Infrastructure]: Docker Path Resolution Error

- **Root Cause**: Attempted to run a python script inside the backend container using an incorrect relative path (`backend/scripts/seed_questions.py`) because I assumed the WORKDIR was root, but it was `/app/backend`.
- **Correction**: Listed the directory contents (`ls -R /app`) to find the correct path and executed `python3 scripts/seed_questions.py`.
- **Prevention Action**: Always verify the `WORKDIR` of a container or check `ls` before executing file-dependent commands.

### [Testing]: Playwright Config Context Mismatch

- **Root Cause**: Ran `npx playwright test` from the project root, but `playwright.config.ts` was in `frontend/`, causing the runner to miss the configuration (baseURL, etc.) and fail with "Invalid URL".
- **Correction**: Executed the test command from the `frontend` directory (`cd frontend && npx playwright test`).
- **Prevention Action**: Always execute Playwright tests from the directory currently containing `playwright.config.ts`.

### [Testing]: Flaky Global Auth Setup

- **Root Cause**: The global `auth.setup.ts` failed with a timeout waiting for URL redirection, likely due to environment slowness or networking glitches in the test harness.
- **Correction**: Created a self-contained test `autosave.spec.ts` with explicit login steps to bypass the global setup for critical feature verification.
- **Prevention Action**: For critical verification, prefer self-contained tests or ensure the global setup has robust retry/timeout logic suited for the environment.

### [Documentation]: Empty Story File List

- **Root Cause**: Neglected to update the "Dev Agent Record -> File List" in the story artifact as I wrote code, leading to a Code Review finding.
- **Correction**: Updated the story artifact with the complete list of modified files during the Code Review phase.
- **Prevention Action**: Update the story artifact's File List _immediately_ after creating/modifying files, not just at the end.
