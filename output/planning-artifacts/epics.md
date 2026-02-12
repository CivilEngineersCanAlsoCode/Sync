---
stepsCompleted:
  [
    "step-01-validate-prerequisites",
    "step-02-design-epics",
    "step-03-create-stories",
    "step-04-final-validation",
  ]
inputDocuments:
  - output/planning-artifacts/prd.md
  - output/planning-artifacts/architecture.md
  - output/planning-artifacts/ux-design-specification.md
  - User_Prompt_New_Requirements
---

# Resume personalisation - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Resume personalisation, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1 (Modified):** User creates a Job with Title, Company, Job Link, and JD. Default status is "Draft". (Source: User Prompt/PRD)
- **FR2 (Modified):** User views Jobs Dashboard. Columns: Title, Company, Job Link, Status. Actions: "View job details", "Delete job". No "Edit" or "Copy ID". (Source: User Prompt)
- **FR3 (Modified):** User uploads a single "Standard Base Resume" in Profile Settings. This serves as the base for all tailoring. (Source: User Prompt)
- **FR4 (New):** Clicking "Job Name" in Dashboard redirects to an "Analysis Page" where a questionnaire based on JD & Resume is presented. (Source: User Prompt)
- **FR5:** System analyzes JD and Base Resume to generate "Mandatory Probing Questions". (Source: PRD)
- **FR6:** User answers probing questions; AI generates tailored bullet points. (Source: PRD)
- **FR7:** AI automatically re-orders bullet points (Gravity Logic). (Source: PRD)
- **FR8:** System enforces 1.0-2.0 line width (LaTeX layout) via "Precision-Fit" algorithm. (Source: PRD/Arch)
- **FR9 (Modified):** "Resumes" screen displays _only_ customized resumes linked to jobs. Actions: "Download", "Copy Overleaf Link". No upload button here. (Source: User Prompt)
- **FR10:** User can export the final resume to Overleaf. (Source: PRD)
- **FR11:** All data stored locally (SQLite) and backed up weekly. (Source: PRD)

### NonFunctional Requirements

- **NFR1 (Performance):** JD processing and initial questions < 30 seconds.
- **NFR2 (Performance):** Total Tailoring Loop < 2 minutes.
- **NFR3 (Privacy):** Local-First Architecture. No PII sent to cloud except AI API.
- **NFR4 (Reliability):** Multi-turn session state persistence.
- **NFR5 (UX):** Achromatic "Surgical" UI with Teal accents.

### Additional Requirements

- **Tech Stack:** FastAPI, React, SQLModel, PostgreSQL, Docker.
- **Architecture:** "Romanised Hindi" comments rule for all code.
- **Architecture:** "Pixel Proxy" service for precise text width calculation.
- **UX:** "Rectangular Block" validation visual feedback.
- **UX:** "Desktop-First" for editing, "Mobile-First" for review.
- **Database:** Remove existing resumes (Cleanup Done).
- **Startup:** Nginx/Traefik for routing (implied from existing setup).

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

## Epic List

### Epic 1: Job Management & Dashboard

**Goal:** Enable users to manage their job applications and track their progress.
**FRs covered:** FR1, FR2, FR4, FR11.
**Implementation Notes:**

- Create Job (Title, Company, Link, JD) -> Status: Draft.
- Dashboard with columns: Title, Company, Link, Status.
- Actions: View Job Details, Delete Job.
- Click Job Name -> Redirect to Analysis Page.
- Local SQLite storage.

### Epic 2: Resume Profile & Analysis

**Goal:** Establish a single truth source for the user's career history and analyze it against job descriptions.
**FRs covered:** FR3, FR5.
**Implementation Notes:**

- Profile Settings: Upload "Standard Base Resume" (One-time).
- Analysis Page: Verify "Mandatory Probing Questions" generated from JD + Base Resume.

### Epic 3: Surgical Tailoring Loop

**Goal:** Empower users to tailor their resume bullets precisely to the job description using AI.
**FRs covered:** FR6, FR7, FR8.
**Implementation Notes:**

- Interactive Questionnaire (Probing Questions).
- AI Bullet Generation & Gravity Re-ordering.
- "Precision-Fit" Algorithm (1.0 - 2.0 lines LaTeX width).
- Rectangular Block Validation.

### Epic 4: Final Polish & Export

**Goal:** Delivery of a professional, tailored resume that is ready for submission.
**FRs covered:** FR9, FR10.
**Implementation Notes:**

- Resumes Screen: View _only_ tailored resumes linked to jobs.
- Action: Download PDF (future), Copy Overleaf Link.

## Epic 1: Job Management & Dashboard

**Goal:** Enable users to manage their job applications and track their progress.

### Story 1.1: Create Job Entry (Draft)

As a User,
I want to create a new job entry with Title, Company, Link, and JD,
So that I can start the tailoring process for a specific application.

**Acceptance Criteria:**

**Given** I am on the Jobs Dashboard
**When** I click "Add Job" and enter Title, Company, Link, and JD
**Then** the job is saved with status "Draft"
**And** I am redirected to the Dashboard where the new job appears

### Story 1.2: Job Dashboard & List View

As a User,
I want to view all my tracked jobs in a dashboard,
So that I can see which applications are in progress or completed.

**Acceptance Criteria:**

**Given** I have saved jobs
**When** I visit the Dashboard
**Then** I see a list of jobs with Title, Company, Link, and Status
**And** Status badges show correct colors (Draft=Gray, Tailored=Blue, Applied=Green)
**And** Clicking the Job Title redirects to the Analysis Page

### Story 1.3: Job Actions (View & Delete)

As a User,
I want to view details or delete a job,
So that I can manage my application list.

**Acceptance Criteria:**

**Given** I am on the Jobs Dashboard
**When** I click the "Three-dot" menu on a job row
**Then** I see options for "View Job Details" and "Delete Job"
**When** I select "Delete Job" and confirm
**Then** the job is permanently removed from the database

## Epic 2: Resume Profile & Analysis

**Goal:** Establish a single truth source for the user's career history and analyze it against job descriptions.

### Story 2.1: Base Resume Upload (Profile Settings)

As a User,
I want to upload a single "Master Resume" in my profile settings,
So that the system has a baseline of my skills and experience for tailoring.

**Acceptance Criteria:**

**Given** I am on the Profile Settings page
**When** I upload a PDF file in the "Base Resume" section
**Then** the file is parsed and saved locally as my Master Resume
**And** any existing resume is replaced (One-time setup)

### Story 2.2: Job Analysis & Probing Generation

As a User,
I want the system to analyze my Base Resume against a specific Job Description,
So that it can identify gaps and ask me relevant questions.

**Acceptance Criteria:**

**Given** I click a Job Title from the Dashboard
**When** the Analysis Page loads
**Then** the system triggers an AI analysis of the Job's JD vs My Base Resume
**And** "Mandatory Probing Questions" are generated and displayed
**And** a loading state is shown during analysis (< 30s)

## Epic 3: Surgical Tailoring Loop

**Goal:** Empower users to tailor their resume bullets precisely to the job description using AI.

### Story 3.1: Probing Questionnaire Interface

As a User,
I want to answer the AI-generated probing questions,
So that I can provide the missing context needed for tailoring.

**Acceptance Criteria:**

**Given** the Analysis Page has loaded
**When** I see the "Mandatory Probing Questions"
**Then** I can enter multi-line text answers for each question
**And** the "Generate Tailored Resume" button becomes active only after all questions are answered

### Story 3.2: AI Bullet Generation & Gravity Logic

As a User,
I want the AI to rewrite my resume bullets based on my answers and the JD,
So that they are highly relevant and prioritized.

**Acceptance Criteria:**

**Given** I have answered all questions
**When** I click "Generate Tailored Resume"
**Then** the AI rewrites my resume bullet points
**And** it applies "Gravity Logic" to re-order bullets by impact
**And** the job status changes to "Tailored"

### Story 3.3: Precision-Fit Layout Validation

As a User,
I want to see if my bullet points fit perfectly within 1.0 - 2.0 lines,
So that my resume looks professional and adheres to the "Rectangular Block" design.

**Acceptance Criteria:**

**Given** the tailored bullets are displayed
**Then** the system calculates the exact pixel width (using Pixel Proxy)
**And** visual indicators show Green/Blue for perfect fit (1.0 or 2.0 lines)
**And** indicators show Orange/Red for overflow or underflow
**And** I can manually edit the text to fix the layout

## Epic 4: Final Polish & Export

**Goal:** Delivery of a professional, tailored resume that is ready for submission.

### Story 4.1: Tailored Resumes List

As a User,
I want to see a list of my tailored resumes linked to specific jobs,
So that I can access the correct version for each application.

**Acceptance Criteria:**

**Given** I am on the Resumes Dashboard
**Then** I see a list of tailored resumes linked to specific jobs
**And** each row shows Job Title, Company, and Date Created
**And** there is NO "Upload Resume" button (this is restricted to Profile Settings)

### Story 4.2: Export Options (Overleaf & PDF)

As a User,
I want to export my tailored resume,
So that I change submit it.

**Acceptance Criteria:**

**Given** I am on the Resumes list or Job Analysis page
**When** I select "Export"
**Then** I see options for "Copy Overleaf Link" and "Download PDF" (Placeholder for Phase 2)
**When** I click "Copy Overleaf Link"
**Then** the LaTeX code is prepared for Overleaf import
