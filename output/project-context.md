---
project_name: "Resume personalisation"
user_name: "satvik"
date: "2026-02-12"
sections_completed:
  [
    "technology_stack",
    "language_rules",
    "framework_rules",
    "quality_rules",
    "workflow_rules",
  ]
existing_patterns_found: 12
status: "finalized"
---

# Project Context for AI Agents (Sync)

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Backend:** FastAPI (Python 3.10+) with SQLModel for Postgres.
- **Frontend:** React (Next.js) with Shadcn/UI and Tailwind CSS.
- **Database:** PostgreSQL (Local Docker Container).
- **Orchestration:** n8n (Vector Sync) & Docker Compose (Apple Silicon optimized).
- **Utilities:** Python `Pillow` & `FontTools` for character-width "Pixel Proxy".

## Critical Implementation Rules

### 1. Language-Specific Rules (The "Surgical" Python/TS)

- **The Romanised Hindi Rule (MANDATORY):** Every function or complex logic block MUST have a 1-line Romanised Hindi comment **BELOW** (not above) the definition.
  - _Example:_ `def sync_bullet(): ... # Is function se AI bullet ko tailor karta hai.`
- **Python Conventions:** Use `snake_case`. Strict type hinting for all services.
- **React Conventions:** Use `PascalCase` for components. Functional components only with Hooks.
- **Sync Logic:** Always use `streaming` for AI completions to enable the "Surgical Typewriter" effect.

### 2. Framework & Layout Rules

- **Symmetry Lock:** Resizable panels must maintain a 50/50 or 40/60 split for the "Surgical Canvas".
- **Component Anatomy:** Custom components like `SyncCanvas` must enforce `text-align-last: justify` via Tailwind.
- **Overlay Hierarchy:** AI Probing popovers must be relative to the active line.

### 3. Code Quality & Style (The "Golden" Standard)

- **Constraint-First:** Logic must error out (Coral Warning) if a bullet exceeds **1.0 line** or violates X-Y-Z formula.
- **Verb Ethics:** Ensure the AI service maintains a `used_verbs` set to prevent repetition in a single session.
- **Error Messages:** All user-facing error strings MUST be in Romanised Hindi.
  - _Example:_ `{ "error": "Data save nahi ho paya", "code": "DB_ERR" }`

### 4. Critical "Don't-Miss" Rules

- **PII Guardrails:** Never log actual resume data to the console. Only log structural metadata (e.g., "Bullet length: 485px").
- **M1 Optimization:** Do not use libraries that require binary compilation outside of the Docker container.

---

**Status:** ✅ Project Context Finalized for AI Agents.
