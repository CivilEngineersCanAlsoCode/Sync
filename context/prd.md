---
stepsCompleted:
  [
    "step-01-init",
    "step-02-discovery",
    "step-03-success",
    "step-04-journeys",
    "step-05-domain",
    "step-06-innovation",
    "step-07-project-type",
    "step-08-scoping",
    "step-09-functional",
    "step-10-nonfunctional",
    "step-11-polish",
  ]
inputDocuments:
  [
    "planning-artifacts/product-brief-Sync-2026-02-11.md",
    "planning-artifacts/research/technical-sync_architecture-research-2026-02-11.md",
  ]
classification:
  projectType: Developer Tool / Self-Hosted Web App
  domain: CareerTech (Open Source)
  complexity: Medium
  projectContext: Greenfield
workflowType: "prd"
---

# Product Requirements Document - Sync

**Author:** Satvik
**Date:** 2026-02-11
**Version:** 1.0 (Polished)

## 1. Executive Summary

**Sync** is a self-hosted, privacy-first Resume Builder designed for developers who want the power of AI-driven tailoring without sacrificing data sovereignty or their LaTeX/Overleaf workflows. Unlike SaaS tools, Sync runs locally via Docker, uses the user's own API keys (BYOK), and pushes clean LaTeX code directly to Overleaf via Git, enabling a "Tailor -> Review -> Submit" loop in under 5 minutes.

## 2. Success Criteria

### User Success

- **Speed:** Reduce "Resume Tailoring" time per application from 30+ minutes to **< 5 minutes**.
- **Quality:** Generated LaTeX compiles **100% of the time** without syntax errors or broken layouts.
- **Reliability:** Changes made in Sync app reflect in Overleaf within **20 seconds** of triggering sync.

### Business Success (Open Source Adoption)

- **MVP Adoption:** Successfully used by the author (Satvik) for **10+ job applications**.
- **Community:** Repository achieves **50+ GitHub Stars** in Month 1.
- **Onboarding:** A new developer can deploy locally in **< 15 minutes**.

### Technical Success

- **Zero-Conf:** `docker-compose up` spins up the full stack without manual config editing.
- **Privacy:** No resume data leaves the local machine (except to configured APIs).

## 3. User Journeys

### Journey 1: "The Last Minute Application" (Success Path)

**User:** Satvik (Applicant)
**Goal:** Apply for a "Senior Dev" role closing in 1 hour.

1.  **Discovery:** Satvik finds a perfect job on LinkedIn. He copies the Description.
2.  **Input:** Pastes JD text into Sync. Selects his "Master Resume".
3.  **Interaction:** System asks: _"The JD emphasizes Kubernetes. Describe your specific experience with scaling clusters."_
4.  **Response:** Satvik types a quick answer.
5.  **Processing:** AI combines his answer with his "Project Stories" vector db to generate tailored bullet points.
6.  **Review:** Satvik sees the Diff View: _"+ Led migration to Kubernetes"_. He approves.
7.  **Sync:** Clicks **"Sync to Overleaf"**. App pushes to Git.
8.  **Completion:** Opens Overleaf. Compiles. Downloads PDF. Applied in 5 mins.

### Journey 2: "The Broken Layout" (Edge Case)

**User:** Satvik (Applicant)

1.  **Conflict:** AI generates too much text; LaTeX spills to Page 2.
2.  **Recovery:** Satvik clicks **"Edit Code"**. Trims two lines in the in-app Monaco editor.
3.  **Resolution:** Clicks "Preview PDF". Layout fixed. Syncs to Overleaf.

### Journey 3: "The Contributor" (Open Source Dev)

**User:** Alex (External Developer)

1.  **Onboarding:** Alex forks repo options `docker-compose up`.
2.  **Success:** Dashboard loads on `localhost:3000` in < 15 mins.
3.  **Action:** Adds a "Cover Letter" node to the n8n workflow JSON and submits PR.

## 4. Functional Requirements

### 4.1 Data Management (SQLite + Pinecone)

- **FR-01:** User can upload a PDF resume. System extracts text and stores metadata in SQLite.
- **FR-02:** User can input "Project Stories" (career narratives). System vectorizes these into **Pinecone** for semantic retrieval.
- **FR-03:** System saves every _generated_ resume version to local storage (Snapshot) for future reference.

### 4.2 Job & Interactive Tailoring (Core Loop)

- **FR-04:** User creates a Job by pasting **Job Description Text** (URL is optional metadata).
- **FR-05 (Smart Questioning):** System analyzes JD and **generates 3-5 specific questions** ("Describe your experience with [Requirement X]").
- **FR-06:** User answers questions in the UI.
- **FR-07:** System combines User Answers + Pinecone Stories to generate Tailored Resume (LaTeX).
- **FR-08:** Job Status Tracking: **Draft** -> **In Progress** -> **Done**.

### 4.3 Content Generation

- **FR-09:** System generates a **3-paragraph Cover Letter** (Markdown/Text) based on resume + JD.
- **FR-10:** System generates a **5-Line Executive Summary** (Impactful one-liners) for recruiter messages.

### 4.4 Sync & Integration

- **FR-11:** User can sync final `.tex` to Overleaf projects via Git Push.
- **FR-12:** User can preview PDF locally (via `pdflatex` in Docker).

### 4.5 Documentation

- **FR-13:** "Zero-to-Hero" `README.md`: Step-by-step setup for Docker, VS Code, GitHub Actions, and Overleaf Sync (Simple English).

## 5. Non-Functional Requirements

- **NFR-01 (Privacy):** Zero Telemetry. No PII sent to external servers by default.
- **NFR-02 (Secrets):** API Keys managed via `.env` only.
- **NFR-03 (Usability):** Setup time < 15 minutes.
- **NFR-04 (Reliability):** Overleaf Sync latency < 20 seconds.
- **NFR-05 (Resilience):** Containers use `restart: unless-stopped` policy.

## 6. Product Scope (MVP)

- **MVP Features:**
  - Dashboard (Jobs/Resumes).
  - Interactive Tailoring (Questions -> AI -> LaTeX).
  - Cover Letter Generator.
  - Local PDF Preview.
  - Overleaf Git Sync.
- **Post-MVP (Phase 2):**
  - Multi-User Support.
  - Cloud Deployment.
  - Plugin System.

## 7. Technical Architecture

- **Backend:** Python (FastAPI) for logic/Jinja2.
- **Orchestration:** n8n (Webhooks) for AI/Vector flows.
- **Frontend:** Next.js (Localhost).
- **Database:** SQLite (Data) + Pinecone (Vectors).
- **Infrastructure:** Docker Compose.

## 8. Innovation & Risks

- **Innovation:** Data Sovereignty (Local AI) + Dev-Native Workflow (Overleaf/Git).
- **Risk:** Users find Docker setup hard. _Mitigation:_ Grade 6 Readability Documentation + `start.sh` script.
