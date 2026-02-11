# Project Context: Sync

> **Status:** Consolidated Source of Truth
> **Date:** 2026-02-11
> **Purpose:** Unified context for restarting artifact creation.

---

## Part 1: Product Brief (Vision & Strategy)

**Executive Summary:**
**Sync** is a self-hosted, privacy-first Resume Builder designed for developers. It leverages AI (Gemini) for tailoring but maintains data sovereignty and integrates with professional workflows (LaTeX/Overleaf/Git). It democratizes high-quality, ATS-optimized resumes without the monthly subscriptions of SaaS tools.

**Core Value Proposition:**

1.  **Tracker-First:** Job Application tracking + Resume Tailoring in one flow.
2.  **Privacy:** User owns their data (SQLite/Pinecone locally).
3.  **Professional Output:** LaTeX (via Overleaf) instead of HTML-to-PDF.
4.  **Dev-Native:** Git-backed version control for resumes.

**Success Metrics:**

- **Speed:** Job Link -> Valid PDF in < 2 minutes.
- **Cost:** < $0.01 per resume (Gemini Flash).
- **Adoption:** 50+ GitHub Stars in Month 1.

---

## Part 2: Product Requirements (The "What")

### MVP Scope (Phase 1)

- **Dashboard:** Job Tracker (Company/Role/Link) + Resume List.
- **Resume Parser:** Extract text from existing PDF to base profile.
- **Tailoring Engine:**
  - **Question-Driven Workflow:** AI analyzes JD -> Asks questions -> User answers -> AI tailored bullet points.
  - **Vector Integration:** "Project Stories" stored in Pinecone for semantic retrieval.
- **Output:** High-quality LaTeX code.
- **Integration:**
  - **Overleaf:** One-click sync (Git Push) to Overleaf project.
  - **Local Preview:** `pdflatex` preview in Docker.
- **Docs:** "Zero-to-Hero" Setup Guide.

### Functional Requirements (Key)

- **Data:** SQLite (Metadata), Pinecone (Vectors).
- **Sync:** Git-based push to Overleaf; Local Snapshot of every generated version.
- **Content:** Auto-generate specific Cover Letter & 5-line Executive Summary.

### Non-Functional Requirements

- **Privacy:** Zero Telemetry. Steps to secure API keys (.env).
- **Performance:** Overleaf Sync < 20s. Setup < 15 mins.
- **Usability:** Documentation at Grade 6 reading level.

### Technical Stack

- **Frontend:** Next.js (Localhost).
- **Backend:** Python (FastAPI) + Jinja2 (Templating).
- **Orchestrator:** n8n (Visual Workflows).
- **Database:** SQLite + Pinecone.
- **Infra:** Docker Compose.

---

## Part 3: Advanced Elicitation (Risks & Architecture)

### Critical Risks & Mitigations

1.  **Vector/AI Complexity:**
    - _Risk:_ Debugging n8n visual flows is harder than code.
    - _Mitigation:_ Use "Fire-and-Forget" pattern (Async Callback).
2.  **Local Infrastructure:**
    - _Risk:_ Docker OOM or Pinecone Rate Limits.
    - _Mitigation:_ Queue/Batching in n8n; `restart: unless-stopped`.
3.  **Security:**
    - _Risk:_ Exposing n8n webhooks.
    - _Mitigation:_ Proxy ALL requests through Next.js backend (Middleware validation) -> Internal Docker Network -> n8n.

### Architecture Decision Record (ADR-001)

- **Decision:** Use self-hosted **n8n** for AI/Vector logic.
- **Why:** Faster velocity for chaining AI calls. Easier to visualize data flow than pure Python scripts.
- **Trade-off:** Adds DevOps complexity (container maintenance).

---

## Part 4: Competitive Reference (Inspiration)

**Benchmark: FlowCV**

- **Key Features to Match/Beat:**
  - "Free Forever" / "Privacy First" messaging.
  - "No Watermarks".
  - "Unlimited Downloads".
- **Differentiation:**
  - FlowCV = HTML/CSS based (Good UI, but rigid).
  - Sync = LaTeX/Overleaf based (Professional typesetting, Git versioning).
