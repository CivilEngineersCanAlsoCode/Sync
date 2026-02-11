stepsCompleted: [1, 2, 3, 4]
workflowType: "epics-and-stories"
lastStep: 4
status: "complete"
completedAt: "2026-02-11"
inputDocuments:
[
"output/planning-artifacts/prd.md",
"output/planning-artifacts/architecture.md"
]

---

# Resume personalisation (Sync) - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Resume personalisation (Sync), decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User job ki details (Title, Company, JD text) manually save kar sakta hai.
FR2: User apni saved jobs ki list manage kar sakta hai.
FR3: User base resume PDF upload karke projects extract kar sakta hai.
FR4: User apne profile data ko manually edit ya add kar sakta hai.
FR5: AI user se project-specific "Mandatory Probing Questions" pooch sakta hai.
FR6: User ke answers ke basis par AI testable bullet points draft karega.
FR7: AI bullet points ko automatically re-order (Gravity Logic) karega.
FR8: System har bullet ki width LaTeX font ke mutabiq check karke 1.0-2.0 lines ke beech rakhega.
FR9: Saara data locally SQLite/CSV mein store hoga aur weekly backup hoga.
FR10: User final resume ko direct Overleaf par export kar sakta hai.

### NonFunctional Requirements

NFR1: Performance - JD processing aur initial tailoring questions < 30 seconds mein hone chahiye.
NFR2: Performance - Total Loop (from Job to LaTeX) < 2 minutes hona chahiye.
NFR3: Privacy - 100% local-only routing, PII data strictly local except for AI API calls.
NFR4: Reliability - Multi-turn session state persistence taaki refresh par progress lost na ho.
NFR5: Reliability - Graceful degradation (user-friendly Romanised Hindi error messages).

### Additional Requirements

- **Starter Template:** Full-Stack FastAPI Template (Tiangolo) based on Docker & Postgres.
- **Coding Pattern:** Romanised Hindi comments hamesha code block ke **NEECHE** honge.
- **Error Format:** `{ "error": "Romanised Hindi Msg", "code": "TECH_CODE" }`.
- **Validation Engine:** Dedicated "Pixel Proxy" service using Pillow/FontTools for character-width check.
- **Gravity Rule:** Vertical height tracking to ensure one-page resume guarantee.
- **UX Pattern:** Real-time AI result streaming for better engagement.
- **Authentication:** JWT/OAuth2 login for personal dashboard security.
- **Persistence:** n8n workflow for background Q&A updates.

### FR Coverage Map

FR1: Epic 2 - Job Management (Manual Save)
FR2: Epic 2 - Job Management (List/Manage)
FR3: Epic 3 - Profile & Career Data (Resume Parsing)
FR4: Epic 3 - Profile & Career Data (Manual Edit)
FR5: Epic 4 - Personalisation Engine (AI Probing)
FR6: Epic 4 - Personalisation Engine (AI Bullet Drafting)
FR7: Epic 4 - Personalisation Engine (Gravity Re-ordering)
FR8: Epic 4 - Personalisation Engine (Pixel Width Validation)
FR9: Epic 5 - Export & Persistence (Data Persistence & Backups)
FR10: Epic 5 - Export & Persistence (Overleaf Bridge)

## Epic List

### Epic 1: Full-Stack Project Foundation

Humne **Full-Stack Titan** template setup kar liya hai. Is epic mein environment ko Apple Silicon (M1/M2/M3) ke liye optimize kiya jayega aur JWT authentication enable karenge taaki dashboard secure rahe.
**FRs covered:** N/A (Functional baseline)

#### Story 1.1: Core Environment & Docker Apple Silicon Setup

As a developer, I want to initialize the project with Tiangolo's FastAPI template and optimize it for Apple Silicon, so that the local development environment is stable and fast.

**Acceptance Criteria:**

- **Given** Docker Desktop run ho raha hai M1/M2/M3 Mac par
- **When** main `docker-compose up` command run karta hun
- **Then** backend, frontend, aur postgres containers bina kisi architecture mismatch error ke start hone chahiye.
- **And** `docker-compose.yml` file ke **NEECHE** ek Romanised Hindi comment hona chahiye jo is config ka purpose samjhaye.

#### Story 1.2: Database Connection & Basic SQLModel Setup

As a system, I want to establish a reliable connection to PostgreSQL using SQLModel, so that career data (JDs and Resumes) can be stored persistently.

**Acceptance Criteria:**

- **Given** Postgres container healthy state mein hai
- **When** backend main entry point launch hota hai
- **Then** "Database Connected" ka message logs mein dikhna chahiye.
- **And** agar connection fail ho, toh error message format `{ "error": "Database se connect nahi ho pa rahe hain, please settings check karein", "code": "DB_CONN_ERROR" }` hona chahiye.

#### Story 1.3: Secure Dashboard Login (JWT)

As a user, I want to log in to my local Sync dashboard, so that my personal career data remains private and secure from unauthorized LAN access.

**Acceptance Criteria:**

- **Given** app local machine par run ho rahi hai
- **When** main login page par valid credentials enter karta hun
- **Then** mujhe ek JWT token milna chahiye aur dashboard ka access milna chahiye.
- **And** login fail hone par error message format `{ "error": "Login fail ho gaya, please check credentials", "code": "AUTH_FAILED" }` hona chahiye.

### Epic 2: Job Intelligence & Management

User apni dream jobs ki details save kar sakega aur unhe manage kar sakega. Isse AI ko target mil jayega ki resume kis direction mein "Sync" karna hai.
**FRs covered:** FR1, FR2

#### Story 2.1: Add New Job Listing (Manual)

As a user, I want to manually input Job Title, Company Name, and JD text, so that I can start the tailoring process for a specific role.

**Acceptance Criteria:**

- **Given** main "Add Job" page par hun
- **When** main Title, Company, aur JD text submit karta hun
- **Then** data Postgres database mein save hona chahiye.
- **And** page par success message Romanised Hindi mein dikhna chahiye.

#### Story 2.2: Jobs Management Dashboard

As a user, I want to see a list of all my saved jobs with their status, so that I can track my tailoring progress.

**Acceptance Criteria:**

- **Given** mere paas multiple saved jobs hain
- **When** main "Jobs Dashboard" open karta hun
- **Then** mujhe jobs ki list (Title/Company) dikhni chahiye.
- **And** har entry ke neeche ek Romanised Hindi description hona chahiye context ke liye.

#### Story 2.3: Delete or Archive Job

As a user, I want to delete jobs that are no longer relevant, so that my dashboard stays clean.

**Acceptance Criteria:**

- **Given** dashboard par job list visible hai
- **When** main kisi job par "Delete" click karta hun
- **Then** wo record database se remove hona chahiye.
- **And** error hone par format `{ "error": "Job delete nahi ho payi", "code": "DELETE_ERROR" }` hona chahiye.

### Epic 3: Career Profile & Skill Extraction

Base resume upload karke user apna career history auto-parse kar sakega. AI system user ke experience ko projects aur skills mein organize kar lega.
**FRs covered:** FR3, FR4

#### Story 3.1: Resume PDF Upload & Text Parsing

As a user, I want to upload my base resume in PDF format, so that the system can read my raw career history.

**Acceptance Criteria:**

- **Given** main "Profile" page par hun
- **When** main ek PDF file upload karta hun
- **Then** backend ko `PyMuPDF` ya similar library se text extract karna chahiye.
- **And** success hone par logs mein Romanised Hindi comment dikhna chahiye.

#### Story 3.2: AI-Driven Project & Skill Extraction

As a system, I want to use AI to categorize the parsed resume text into "Projects", "Experience", and "Skills", so that the data is organized for tailoring.

**Acceptance Criteria:**

- **Given** resume text successfully extract ho gaya hai
- **When** AI extraction process trigger hota hai
- **Then** output ek structured JSON hona chahiye (Projects list ke saath).
- **And** error hone par format `{ "error": "Resume parse nahi ho pa raha", "code": "PARSE_ERROR" }` hona chahiye.

#### Story 3.3: Personal Profile Editor (Manual Tweak)

As a user, I want to manually edit or add to the AI-extracted projects and skills, so that my base profile is 100% accurate.

**Acceptance Criteria:**

- **Given** AI ne data extract kar liya hai
- **When** main kisi field ko edit karke "Save" karta hun
- **Then** updated data Postgres database mein save hona chahiye.
- **And** UI par "Profile Updated Successfully" ka message Romanised Hindi mein aana chahiye.

### Epic 4: "Precision-Fit" Personalisation Engine

Ye "Sync" ka core hai. AI user se sawal poochega, highlights draft karega, aur "Pixel Proxy" algorithm se ensure karega ki bullets Page par perfect dikhein.
**FRs covered:** FR5, FR6, FR7, FR8

#### Story 4.1: AI Probing Questions (The Gap Finder)

As a user, I want the AI to analyze the JD and my profile to ask specific "Probing Questions", so that I can provide the missing context needed for a perfect match.

**Acceptance Criteria:**

- **Given** JD aur Profile data loaded hai
- **When** tailoring session start hota hai
- **Then** AI ko 2-3 specific questions generate karne chahiye (e.g., "Kya aapne is project mein AWS use kiya tha?").
- **And** interaction real-time stream hona chahiye UI par.

#### Story 4.2: Draft Tailored Bullet Points

As a user, I want the AI to generate new bullet points based on my answers, so that my resume highlights exactly what the recruiter is looking for.

**Acceptance Criteria:**

- **Given** user ne probing questions ka answer de diya hai
- **When** AI re-write process trigger hota hai
- **Then** AI ko LaTeX compatible bullet points generate karne chahiye.
- **And** bullets draft mode mein save hone chahiye Postgres mein.

#### Story 4.3: Pixel Proxy Width Validation (The Virtual Ruler)

As a system, I want to measure the pixel-width of each generated bullet using Python Pillow, so that I can ensure they are exactly 1.0 to 2.0 lines long.

**Acceptance Criteria:**

- **Given** AI ne naya bullet draft kiya hai
- **When** Validation layer trigger hota hai
- **Then** system ko pixel-width calculate karke feedback dena chahiye (PASS/FAIL).
- **And** FAIL hone par error Romanised Hindi mein hona chahiye: "Bullet bahut lamba hai, please chhota karein".

#### Story 4.4: One-Page Gravity Re-ordering

As a system, I want to re-order resume sections and projects based on match-score and vertical height, so that the most relevant content fits on one page.

**Acceptance Criteria:**

- **Given** saare tailored bullets ready hain
- **When** "Optimize Layout" button click hota hai
- **Then** system ko vertical height calculate karke items re-order karne chahiye.
- **And** results UI par visible hone chahiye Romanised Hindi comments ke saath.

### Epic 5: Final Export & Data Persistence

Tailored content ko Overleaf par bhejna aur saara data locally Postgres/SQLite mein save karna taaki n8n workflow ke through update ho sake.
**FRs covered:** FR9, FR10

#### Story 5.1: Save Final Tailoring Session

As a user, I want the system to save my final tailored bullets and job details to the database, so that I can revisit them anytime.

**Acceptance Criteria:**

- **Given** tailoring loop complete hai
- **When** main "Finalize Resume" click karta hun
- **Then** final version database mein "COMPLETED" status ke saath save hona chahiye.
- **And** success message Romanised Hindi mein aana chahiye.

#### Story 5.2: Overleaf Bridge (Direct LaTeX Export)

As a user, I want to export my tailored resume directly to Overleaf, so that I can do the final rendering and printing.

**Acceptance Criteria:**

- **Given** tailored content ready hai
- **When** main "Export to Overleaf" click karta hun
- **Then** system ko Overleaf ke public POST endpoint par LaTeX code aur data send karna chahiye.
- **And** error hone par format `{ "error": "Overleaf se connect nahi ho pa rahe hain", "code": "EXPORT_ERROR" }` hona chahiye.

#### Story 5.3: Automated Weekly Backups

As a system, I want to take a weekly snapshot of the Postgres database and save it to a backup folder, so that my data is safe from corruption.

**Acceptance Criteria:**

- **Given** system active hai
- **When** weekly cron job trigger hota hai
- **Then** `.sql` backup file specific `backups/` folder mein save honi chahiye.
- **And** backup log file ke **NEECHE** ek Romanised Hindi comment hona chahiye.

#### Story 5.4: n8n Workflow Sync (Post-Finalization)

As a system, I want to trigger a self-hosted n8n workflow after every resume finalization, so that my Q&A and tailoring history is synced across my personal data vault.

**Acceptance Criteria:**

- **Given** resume finalize ho gaya hai
- **When** completion webhook call hota hai
- **Then** n8n workflow ko job aur Q&A data receive karke save karna chahiye.
- **And** error notification Romanised Hindi mein hona chahiye.
