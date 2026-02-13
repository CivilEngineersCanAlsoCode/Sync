# Story 2.3: Probing Interface & Autosave

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **User**,
I want **to answer probing questions without worrying about saving**,
so that **my flow is uninterrupted**.

## Scope Refinement

- **In Scope**:
  - Build UI for answering questions.
  - Implement Autosave to DB.
  - **Mock Data**: Use manual seeding (`seed_questions.py`) to simulate AI questions, as AI/n8n integration is deferred.
- **Out of Scope (Moved to Future Epic)**:
  - Real-time AI question generation.
  - JD Analysis.
  - Integration with n8n/Vector DB.

## Acceptance Criteria

### ✅ Happy Paths

1.  **View Probing Questions**
    - **Given** a job is in "Ready" status
    - **And** the background generation task has completed
    - **When** I click on the job card in the dashboard
    - **Then** I am navigated to the Job Details page
    - **And** I see a list of AI-generated probing questions
    - **And** the answer fields are initially blank (or show previously saved answers).

2.  **Autosave on Blur**
    - **Given** I am typing an answer for a specific question
    - **When** I move my focus away from the input field (blur event)
    - **Then** the answer is immediately sent to the backend
    - **And** the UI shows a subtle "Saved" indicator next to the field
    - **And** the database is updated with the new answer text.

3.  **UI Feedback State**
    - **Given** an autosave is in progress
    - **When** the request is pending
    - **Then** the input field shows a "Saving..." state (probing spinner or text)
    - **And** changes to "Saved" upon 200 OK response.

### ❌ Sad Paths (Network & Validation)

4.  **Network Failure on Save**
    - **Given** I edit an answer
    - **When** the autosave request fails due to network disconnect
    - **Then** the UI displays a "Save Failed" error message near the field
    - **And** the user is allowed to Retry or the system retries automatically.

5.  **Empty Answer Handling**
    - **Given** I have a previously saved answer
    - **When** I clear the text and click away
    - **Then** the empty string is saved to the database (clearing the answer)
    - **And** the UI reflects the empty state without errors.

### ⚠️ Edge Cases

6.  **Rapid Field Switching**
    - **Given** I type in Question 1
    - **When** I quickly click into Question 2 and then Question 3
    - **Then** Question 1 and Question 2 autosave requests are queued/fired correctly
    - **And** no race conditions occur (e.g., Q1 answer overwriting Q2).

7.  **Long Answer Persistence**
    - **Given** I paste a very long answer (e.g., 2000 chars)
    - **When** the autosave triggers
    - **Then** the backend accepts the full text (TEXT/VARCHAR limits checked)
    - **And** the UI displays the full content without breaking layout.

8.  **Navigation While Saving**
    - **Given** an autosave is currently "Saving..."
    - **When** I accidentally click the "Back" button or navigate away
    - **Then** the browser warns me "Unsaved changes" OR the request completes in the background (Robustness check).

### 🚨 Error Scenarios (System)

9.  **Job Not Found**
    - **Given** I try to access the Job Details page for a deleted/invalid Job ID
    - **When** the page loads
    - **Then** I see a user-friendly "Job Not Found" (404) error page
    - **And** a button to return to the Dashboard.

10. **Draft State Access**
    - **Given** a job is still in "Draft" status (probing not generated)
    - **When** I force-navigate to its Details page
    - **Then** I see a "Generating Questions..." loading state
    - **Or** I am redirected back to the dashboard with a notification.

## Tasks / Subtasks

- [x] **Backend: API Implementation**
  - [x] Create `GET /jobs/{id}` endpoint to fetch job details + questions.
  - [x] Create `PATCH /probing-questions/{id}` endpoint to update answer text.
  - [x] Ensure `PATCH` endpoint handles validation and persistence.
- [x] **Frontend: Job Details Page**
  - [x] Create `JobDetails` page component/route (`/jobs/$jobId`).
  - [x] Implement `useQuery` to fetch job data.
  - [x] Display list of `ProbingQuestion` items.
- [x] **Frontend: Autosave Logic**
  - [x] Create `QuestionInput` component.
  - [x] Implement `onBlur` handler to trigger mutation.
  - [x] Add `Saving/Saved/Failed` UI indicators.
  - [x] Handle error states (Toast notification).
- [x] **Verification**
  - [x] Add unit tests for Backend `PATCH` endpoint.
  - [x] Add Playwright test for Autosave flow (type -> blur -> verify DB).
  - [x] Verify "Rapid Switching" edge case manually or via test.

## Technical Notes

- **Architecture:** Use `React Query` (`useMutation`) for optimistic updates or standard mutation state management.
- **Backend:** `ProbingQuestion` model update.
- **Performance:** `onBlur` is preferred over `onChange` debounce for this story to reduce API calls, as per "flow is uninterrupted" requirement.
- **Romanised Hindi:** Add comments to all new functions.

### File List

- `backend/app/models.py`
- `backend/app/api/routes/jobs.py`
- `backend/app/api/routes/probing_questions.py`
- `backend/scripts/seed_questions.py`
- `frontend/src/client/types.gen.ts`
- `frontend/src/client/sdk.gen.ts`
- `frontend/src/routes/_layout/jobs/$jobId.tsx`
- `frontend/src/components/ProbingQuestionInput.tsx`
- `frontend/tests/autosave.spec.ts`

### Change Log

- **Backend**: Update `Job` and `ProbingQuestion` models. Implement `PATCH /probing-questions` endpoint.
- **Frontend**: Create `JobDetails` page and `ProbingQuestionInput` component.
- **Tests**: Add E2E autosave test.
- **Scripts**: Add manual seed script for probing questions.
