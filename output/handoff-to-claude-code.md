# BMad Handoff: Sync Project to Claude Code

**Subject:** Resume Personalisation "Sync" - Foundation Complete, Moving to Authentication.
**Status:** Story 1.1 [DONE], Story 1.2 [DONE], Story 1.3 [PENDING]

Satvik, Stories 1.1 aur 1.2 dono complete ho chuke hain. Environment setup aur Database connection dono production-ready hain. Ab **Story 1.3: Secure Dashboard Login (JWT)** next hai.

---

## Project Context for Claude Code

This project follows the **BMAD Method (v6)**. It is a "Surgical" Resume Personalisation engine.

### Key Locations (The Holy Grails)

1. **[Project Context](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/project-context.md):** MUST READ FIRST. Contains coding standards (Romanised Hindi comments) and tech stack.
2. **[PRD](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/prd.md):** Core business logic and "Role Resonance" rules.
3. **[Architecture](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/architecture.md):** Tech stack (FastAPI, React, Postgres, SQLModel).
4. **[Epics & Stories](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/epics.md):** The source of truth for all requirements.
5. **[Sprint Status](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/implementation-artifacts/sprint-status.yaml):** Current progress tracker.

---

## Technical Progress (Completed Stories)

### Story 1.1: Core Environment & Docker Apple Silicon Setup [DONE]

- **Template:** Scavenged Tiangolo's FastAPI template.
- **Docker:** Optimized for Apple Silicon (`platform: linux/arm64`).
- **Config:** `.env` initialized with defaults.
- **Verification:** `docker compose config` is passing.

### Story 1.2: Database Connection & Basic SQLModel Setup [DONE]

- **Engine:** SQLModel engine configured in `backend/app/core/db.py`.
- **Healthcheck:** PostgreSQL 18 container with `pg_isready` healthcheck (interval 10s, retries 5).
- **Startup Verification:** `verify_db_connection()` called via lifespan hook in `main.py`.
- **Pre-start:** `backend_pre_start.py` ensures DB readiness with retry logic.
- **Error Handling:** Romanised Hindi error format `{ "error": "...", "code": "DB_CONN_ERROR" }` implemented.
- **Dependencies:** `sqlmodel>=0.0.21` aur `psycopg[binary]>=3.1.13` in `pyproject.toml`.

### Current State:

- **Story 1.1:** [DONE] — [Story File](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/implementation-artifacts/stories/1-1-core-environment-docker-apple-silicon-setup.md)
- **Story 1.2:** [DONE] — [Story File](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/implementation-artifacts/stories/1-2-database-connection-basic-sqlmodel-setup.md)
- **Next Up:** **Story 1.3: Secure Dashboard Login (JWT)**

---

## Instructions for Claude Code (How to Proceed)

Claude, aapko BMAD environment mein kaam karna hai. Use these commands:

1.  **Initialize Context:**

    ```bash
    # Read the context first
    cat "output/project-context.md"
    ```

2.  **Generate Next Story:**

    ```bash
    # Run the create-story workflow for Story 1.3
    # Command: /create-story 1.3
    ```

3.  **Execute Implementation (Dev Mode):**
    ```bash
    # Run the implementation workflow
    # Command: /dev-story 1.3
    ```

---

## Mandatory "Surgical" Rules

- **Romanised Hindi:** Har file/function ke neeche ek Romanised Hindi comment hona chahiye jo logic explain kare.
- **M1/M2/M3:** Always use arm64 platforms for Docker.
- **Error Format:** `{ "error": "Romanised Hindi Msg", "code": "TECH_CODE" }`.
- **One Page Gravity:** Career trajectories ko "Surgical Precision" se fit karna hai.

---

**Handoff Updated by BMad Master.**
