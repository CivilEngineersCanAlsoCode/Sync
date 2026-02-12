# Story 3.3: Personal Profile Editor (Manual Tweak)

## 1. Story Setup

- **Epic:** Epic 3: Career Profile & Skill Extraction
- **Story IDs:** 3.3
- **Tags:** #frontend #backend #profile-editor #crud
- **Developer:** Satvik

## 2. Story Requirements

### User Story Statement

**As a** user,
**I want** to manually edit or add to the AI-extracted projects, experience, and skills,
**So that** my base profile is 100% accurate before I start the tailoring process.

### Business Context & Value

AI extraction (Story 3.2) perfect nahi hoti. User ko "Human-in-the-loop" control dena zaroori hai taaki wo errors fix kar sakein ya missing details add kar sakein. Accurate base profile hi "Precision-Fit" tailoring (Epic 4) ki foundation hai.

### Acceptance Criteria (BDD)

- **Scenario 1: View Extracted Profile**
  - **Given** AI extraction (Story 3.2) complete ho gaya hai
  - **When** main "Profile Editor" page open karta hun
  - **Then** mujhe Projects, Experience, aur Skills ke sections populated dikhne chahiye.

- **Scenario 2: Edit Project Details**
  - **Given** main "Projects" section mein hun
  - **When** main kisi project ka Title ya Description edit karke "Save" click karta hun
  - **Then** updated data database mein persist hona chahiye.
  - **And** UI par "Profile Updated Successfully" (Romanised Hindi) toast aana chahiye.

- **Scenario 3: Add New Skill**
  - **Given** main "Skills" section mein hun
  - **When** main ek nayi skill category ya item add karta hun
  - **Then** wo nayi entry list mein immediately reflect honi chahiye.

- **Scenario 4: Validations**
  - **Given** main edit mode mein hun
  - **When** main kisi mandatory field (e.g., Project Title) ko empty chhodkar save karta hun
  - **Then** UI par required field error dikhna chahiye (Shadcn Form validation).

## 3. Developer Context

### 🏗️ Technical Requirements

#### Backend (FastAPI)

1.  **GET /api/v1/resumes/{id}/profile**:
    - Full nested profile fetch karna hai (`CareerProfile` -> `Projects`, `Experience`, `Skills`).
    - Pydantic schema: `CareerProfileRead`.
2.  **PATCH /api/v1/resumes/{id}/profile**:
    - Nested updates support karne hain.
    - **Optimistic Locking:** Agar zaroorat ho, par filhal simple overwrite chalega (Personal app hai, single user).
    - Validation: Empty strings ya invalid dates reject honi chahiye.

#### Frontend (React + Shadcn/UI)

1.  **Page Layout:**
    - Sidebar: Navigation.
    - Main Area: Tabs/Sections for "Projects", "Experience", "Skills".
2.  **Components:**
    - `ProfileForm`: Main container using `react-hook-form` + `zod`.
    - `ProjectCard`: Editable card for each project.
    - `SkillTagInput`: Skills add/remove karne ke liye interactive component.
3.  **State Management:**
    - React Query (TanStack Query) use karein data fetching aur mutations ke liye.
    - Optimistic updates for snappy feel.

### 💂 Checklists & Guardrails

- [ ] **Romanised Hindi:** Backend log messages aur UI success/error toasts Romanised Hindi mein hone chahiye.
- [ ] **Validation:** Zod schemas frontend par aur Pydantic schemas backend par sync hone chahiye.
- [ ] **Design System:** LinkRight Teal (`#006666`) primary buttons ke liye use karein. "Save" button prominent hona chahiye.
- [ ] **Icons:** Lucide-React icons use karein (Edit pencil, Save disk, Trash can).

## 4. Architecture Standards

### API Structure

- **Route:** `backend/app/api/routes/profiles.py`
- **Schemas:** `backend/app/schemas/profile.py` (Reuse existing form Story 3.2 or extend)
- **CRUD:** `backend/app/crud/crud_profile.py` (Update logic)

### Database (SQLModel)

- Models `CareerProfile`, `Project`, `Experience`, `SkillCategory` already exist (Story 3.2).
- Ensure cascades are set correctly (e.g., deleting a profile deletes related projects).

### UI Patterns (UX Spec Reference)

- **Achromatic Modals:** Context switching ke liye clean white overlays.
- **Feedback:** Success Blue (`#3B82F6`) for "Save Successful" toasts.

## 5. Testing Requirements

- **Manual Testing:**
  - Verify data persistence after page reload.
  - Test validation (empty required fields).
- **Automated Testing:**
  - `backend/tests/api/routes/test_profiles.py`: Test GET and PATCH endpoints.
  - `frontend/tests/profile.spec.ts` (Playwright):
    - Load profile.
    - Edit a project title.
    - Save.
    - Reload and verify change.

## 6. Latest Tech Info (Web Research)

- **React Hook Form + Shadcn:** Use `Form`, `FormControl`, `FormField` wrappers provided by Shadcn for consistent accessible validation.
- **TanStack Query:** Use `useMutation` with `onSuccess` to invalidate queries and trigger toasts.

---

**Status:** ready-for-dev
