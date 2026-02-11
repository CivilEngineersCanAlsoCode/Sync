---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: "architecture"
lastStep: 8
status: "complete"
completedAt: "2026-02-11"
project_name: "Resume personalisation"
user_name: "satvik"
date: "2026-02-11"
---

# Architecture Decision Document - Sync

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together. Isme har technical decision ke peeche ka logic (karan) Romanised Hindi mein explain kiya jayega taaki PM ise aasaani se samajh sakein._

## Project Context Analysis (Step 2)

### Requirements Overview

**Functional Requirements:**
Architecture ko ek stable "Tailoring Loop" handle karna hoga. Isme Job Management, Resume Parsing, aur AI-driven bullet re-writing (Gravity Logic) shamil hain. Sabse critical part LaTeX character-width validation hai jo real-time feedback loop maangta hai.

**Non-Functional Requirements:**

- **Performance:** Poora loop < 2 minutes mein complete hona chahiye (Optimization requirement).
- **Security:** Zero-Cloud trace (Offline-first architecture).
- **Reliability:** Session data persistence taaki refresh par progress lost na ho.

**Scale & Complexity:**

- Primary domain: AI Orchestration & Document Engineering.
- Complexity level: Medium.
- Estimated architectural components: 4 (FastAPI Backend, n8n Orchestrator, SQLite Database, Docker Environment).

### Technical Constraints & Dependencies

- **Stack:** Python (FastAPI) backend.
- **Explainability:** Romanised Hindi comments in all code.
- **Hardware:** Apple Silicon (M1/M2/M3) optimization via Docker.
- **Plumbing:** n8n for background vector sync and data movement.

### Cross-Cutting Concerns Identified

- **Logging & Debugging:** PM-friendly logs (hindi explanations).
- **Data Backup:** Automated weekly SQLite snapshots.

---

## "Precision-Fit" Blueprint (Elicitation Results)

### 🥇 Technical Strategy: Pixel Proxy

- **Decision:** Python Pillow/FontTools ka use karke pixel-width calculation.
- **Rationale (Karan):** LaTeX rendering slow hai, aur simple character count inaccurate. "Pixel Proxy" balance deta hai speed aur precision ke beech (< 2 min loop ke liye).

### 🎯 Truth Service: Validation Layer

- **Decision:** Ek dedicated Validation Service jo AI output ko publish karne se pehle "Measure" karegi.
- **Rationale (Karan):** AI hallucinate kar sakta hai length ko lekar, isliye system mein ek "Virtual Ruler" (inch-tape) ka hona zaroori hai.

### 💀 Quality Gate: Vertical Gravity Tracker

- **Decision:** Resume ki total vertical height ka tracking logic.
- **Rationale (Karan):** Sirf bullet points fix karne se kaam nahi chalega agar total content page se bahar ja raha hai. System "Gravity" decide karega (kaunsa section kitni jagah lega).

---

## Starter Template Evaluation (Step 3)

### Selected Starter: The Full-Stack Titan (Tiangolo's Template)

**Decision:** Humne industry-standard **Full Stack FastAPI Template** (by Tiangolo) ko base chuna hai.

### Tech Stack Ka "Karan" (Rationale)

Aapke project ke liye ye stack kyun zaroori hai, simple terms mein:

1.  **FastAPI (The Engine):**
    - **Kyun?** Ye backend ka sabse modern framework hai. Ye AI models aur browser ke beech ki communications (APIs) ko super-fast handle karta hai. "Sync" ke 2-minute loop ke liye ye perfect hai.
2.  **SQLModel (The Translator):**
    - **Kyun?** Ye Python code aur Database ke beech ka "Middleman" hai. Ye ensure karta hai ki code likhna easy ho aur database errors kam se kam hon.
3.  **PostgreSQL (The Vault):**
    - **Kyun?** Aapka career data (Resumes, JDs) bahut precious hai. Postgres ek extremely reliable "Vault" (Database) hai jo data corruption se bachata hai.
4.  **React (The Dashboard):**
    - **Kyun?** Jo beautiful aur responsive dashboard aap browser mein dekhenge, wo React se banega. Ye rich interactive features (jaise real-time line-width tracking) ke liye best hai.
5.  **Docker (The Box):**
    - **Kyun?** Taaki ye "Sync" app mere Mac par bhi chale aur aapke M1 Mac par bhi exactly waise hi chale. Docker app ko ek sealed "Box" (Container) mein pack kar deta hai, isliye "environment issue" ki problem nahi aati.

**Initialization Command (Note for Dev):**

```bash
npx create-next-app@latest --example https://github.com/tiangolo/full-stack-fastapi-template
```

_(Note: Ye dev-agent use karega implementation phase mein)_

## Cost Model & Licensing (Budget Ki Baat)

**Decision:** Poora tech stack **100% Free** aur **Open Source** hoga.

### Zero-Cost Breakdown:

1.  **Frameworks (FastAPI, React, SQLModel):** MIT License, zero cost.
2.  **Database (Postgres):** Free local server.
3.  **Deployment:** Docker Desktop (Personal) is free.
4.  **Hosting:** $0 (Local Mac M1 run).
5.  **AI Cost:** Only Gemini API fees apply.

**Rationale (Karan):** Satvik aapka goal "Zero Subscription" hai, isliye humne sirf wahi tools chunne hain jo bina kisi recurring cost ke lifetime chal sakein.

---

## Core Architectural Decisions (Step 4)

### 1. Data Architecture

- **Decision:** **PostgreSQL** (Managed by Docker Compose).
- **Rationale (Karan):** Professional local storage jo data isolation aur backups ke liye reliable hai. Template default ke saath bina extra cost ke high-end features milte hain.

### 2. Authentication & Security

- **Decision:** **OAuth2/JWT Auth** with Local Account.
- **Rationale (Karan):** Dashboard ko password-protected banata hai. Privacy mandate (Offline-first) ke saath align hota hai taaki koi bina permission aapka data na dekh sake.

### 3. API & Communication Patterns

- **Decision:** **FastAPI Streaming Responses**.
- **Rationale (Karan):** AI-driven rewrites ko real-time mein UI par display karne ke liye (Zero lag UX). Typewriter effect user ko system ke progress se connected rakhta hai.

---

## Implementation Patterns & Consistency Rules (Step 5)

### 1. Naming & Style

- **Backend (Python):** `snake_case` usage (e.g., `process_resume`).
- **Frontend (TS/React):** `camelCase` usage (e.g., `processResume`).

### 2. The "Romanised Hindi" Rule

- **MANDATORY:** Har function ya complex logic block ke **NEECHE** (below) ek 1-line Romanised Hindi comment hona chahiye.
- **Example:**

```python
def check_page_gravity(content):
    # Logic...
    pass
# Is function se hum check karte hain ki content page se bahar toh nahi ja raha
```

### 3. Standardized Error Handling

- **Format:** `{ "error": "Romanised Hindi Message", "code": "TECH_CODE" }`
- **Rule:** Messages sirf Romanised Hindi mein honge.

---

## Project Structure & Boundaries (Step 6)

### Complete Project Directory Structure

```text
sync-project/
├── backend/                  # FastAPI Core
│   ├── app/
│   │   ├── api/              # API Routes (Jobs, Resumes, Tailoring)
│   │   ├── services/         # Precision-Fit, Gravity, PixelProxy
│   │   ├── models/           # SQLModel Schema
│   │   └── db/               # Postgres Session & Migrations
│   ├── main.py               # Application Start
├── frontend/                 # React UI Dashboard
│   ├── src/
│   │   ├── components/       # UI Atoms
│   │   └── pages/            # Editor, Home
├── docker/                   # Deployment Artifacts
└── docker-compose.yml        # Multi-container config
```

### Requirements to Structure Mapping

- **Job Management (FR1, FR2):** `backend/app/api/jobs.py`
- **Resume Profile (FR3, FR4):** `backend/app/api/resumes.py`
- **Tailoring Loop (FR5-FR7):** `backend/app/services/ai_tailor.py`
- **Layout Integrity (FR8):** `backend/app/services/pixel_proxy.py`
- **Local persistence (FR9):** `backend/app/db/`
- **Export (FR10):** `backend/app/services/exporter.py`
