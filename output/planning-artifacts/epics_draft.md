### Epic List

### Epic 1: Job Management & Dashboard

**Goal:** Enable users to manage their job applications and track their progress.
**FRs covered:** FR1, FR2, FR4, FR11, NFR3, NFR5.
**Implementation Notes:**

- Create Job (Title, Company, Link, JD) -> Status: Draft.
- Dashboard with columns: Title, Company, Link, Status.
- Actions: View Job Details, Delete Job.
- Click Job Name -> Redirect to Analysis Page.
- Local SQLite storage.

### Epic 2: Resume Profile & Analysis

**Goal:** Establish a single truth source for the user's career history and analyze it against job descriptions.
**FRs covered:** FR3, FR5, NFR1.
**Implementation Notes:**

- Profile Settings: Upload "Standard Base Resume" (One-time).
- Analysis Page: Verify "Mandatory Probing Questions" generated from JD + Base Resume.

### Epic 3: Surgical Tailoring Loop

**Goal:** Empower users to tailor their resume bullets precisely to the job description using AI.
**FRs covered:** FR6, FR7, FR8, NFR2, NFR5.
**Implementation Notes:**

- Interactive Questionnaire (Probing Questions).
- AI Bullet Generation & Gravity Re-ordering.
- "Precision-Fit" Algorithm (1.0 - 2.0 lines LaTeX width).
- Rectangular Block Validation.

### Epic 4: Final Polish & Export

**Goal:** delivery of a professional, tailored resume that is ready for submission.
**FRs covered:** FR9, FR10.
**Implementation Notes:**

- Resumes Screen: View _only_ tailored resumes linked to jobs.
- Action: Download PDF (future), Copy Overleaf Link.
- No direct upload on this screen.

### FR Coverage Map

FR1: Epic 1 - Job Creation
FR2: Epic 1 - Dashboard & Actions
FR3: Epic 2 - Base Resume Upload
FR4: Epic 1 - Navigation to Analysis
FR5: Epic 2 - JD Analysis & Probing Questions
FR6: Epic 3 - AI Tailoring
FR7: Epic 3 - Gravity Re-ordering
FR8: Epic 3 - Layout Precision
FR9: Epic 4 - Tailored Resume List
FR10: Epic 4 - Overleaf Export
FR11: Epic 1 - Data Persistence
