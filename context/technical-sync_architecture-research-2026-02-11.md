---
stepsCompleted: [1, 2, 3]
inputDocuments: ["planning-artifacts/product-brief-Sync-2026-02-11.md"]
workflowType: "research"
lastStep: 1
research_type: "technical"
research_topic: "Sync Architecture (LaTeX, Overleaf, Pinecone, GitHub Actions)"
research_goals: "Validate feasibility and specific integration points for the Job-First resume builder stack."
user_name: "Satvik"
date: "2026-02-11"
web_research_enabled: true
source_verification: true
---

# Research Report: Technical

**Date:** 2026-02-11
**Author:** Satvik
**Research Type:** technical

---

## Research Overview

[Research overview and methodology will be appended here]

---

## Technical Research Scope Confirmation

**Research Topic:** Sync Architecture (LaTeX, Overleaf, Pinecone, GitHub Actions)
**Research Goals:** Validate feasibility and specific integration points for the Job-First resume builder stack.

**Technical Research Scope:**

- **Overleaf Integration** - Deep dive into POST API payloads, limitations, and free tier rules.
- **Vector Memory** - Validating n8n + Pinecone workflow for storing user experience (ingestion & retrieval pricing/limits).
- **LaTeX Generation** - Best libraries/approaches to convert "JSON Profile + Job Context" -> "Valid .tex".
- **GitHub Actions** - Setting up a free runner to compile `.tex` to PDF automatically (for Phase 2).

**Research Methodology:**

- Current web data with rigorous source verification.
- Multi-source validation for critical technical claims.
- Confidence level framework for uncertain information.
- Comprehensive technical coverage with architecture-specific insights.

**Scope Confirmed:** 2026-02-11

---

## Technology Stack Analysis

### Programming Languages

**Python (Backend/Logic):**

- **Why:** Excellent string manipulation, rich ecosystem for AI (Gemini SDK), and standard for backend logic.
- **Role:** Handles the "Sync" logic (JSON profile + Job Desc -> Tailored Content) and LaTeX generation.
- **Source:** Industry Standard for AI/Data processing.

**LaTeX (Typesetting):**

- **Why:** The core differentiator. guarantees professional, ATS-friendly PDF output.
- **Role:** The presentation layer. We treat `.tex` as the view engine.
- **Source:** [Overleaf Documentation](https://www.overleaf.com/learn)

### Development Frameworks and Libraries

**Jinja2 (Python Templating):**

- **Role:** Dynamic LaTeX generation.
- **Constraint:** Must create a custom environment with non-standard delimiters (e.g., `BLOCK{ }` instead of `{% %}`) to avoid conflict with LaTeX's native curly braces `{}`.
- **Source:** [Jinja2 Documentation - Custom Delimiters](https://jinja.palletsprojects.com/en/3.1.x/api/#jinja2.Environment)

**React / Next.js (Frontend):**

- **Role:** The dashboard for "Job Tracker".
- **Choice:** Next.js for easy API routes and state management.

### Database and Storage Technologies

**Pinecone (Vector Database):**

- **Role:** Long-term memory for user's past experiences and tailored bullet points.
- **Free Tier Validity:** "Starter" plan offers 1 index, 2GB storage (millions of vectors), and 2M write units/month. More than enough for a single-user MVP (approx 10-100k vectors max).
- **Integration:** Native support in n8n.
- **Source:** [Pinecone Pricing](https://www.pinecone.io/pricing/)

**PostgreSQL / Supabase:**

- **Role:** Relational data (Jobs, User Profile, Saved Resumes).
- **Why:** Structured data requirements for the Job Tracker.

### Development Tools and Platforms

**Overleaf (Editor & Rendering):**

- **Integration Constraint:** **No official POST API** for "Create Project with File".
- **Workaround A:** Use `encoded_snip` URL parameter for small payloads (creating a new project from a snippet).
- **Workaround B:** Link to a Git repository (Phase 2 feature, but robust).
- **Workaround C:** Host the generated `.tex` file publically (e.g., S3/Gist) and use `snip_uri` parameter.
- **Decision for MVP:** `encoded_snip` is easiest for MVP if resume size permits; otherwise `snip_uri`.
- **Source:** [Overleaf Linking to Your Project](https://www.overleaf.com/learn/how-to/Linking_to_your_project)

**n8n (Automation/ETL):**

- **Role:** Orchestrates the ingestion of user data into Pinecone without writing complex backend ETL code.
- **Source:** [n8n Pinecone Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.pinecone/)

### Cloud Infrastructure and Deployment

**GitHub Actions (CI/CD & Compilation):**

- **Role:** The "Compile" engine.
- **Free Tier:** 2,000 action minutes/month (Private Repos).
- **Constraint:** Installing `texlive-full` takes time (~5-10 mins).
- **Optimization:** Must use caching (setup-tex action) or a Docker container to keep build times under 1 minute.
- **Source:** [GitHub Actions Billing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)

**Google Gemini API:**

- **Role:** The Intelligence.
- **Cost:** Flash model is extremely cheap (~$0.35/1M tokens).
- **Source:** [Gemini Pricing](https://ai.google.dev/pricing)

---

## Integration Patterns Analysis

### API Design Patterns

**Sync Engine API (Next.js -> Python):**

- **Pattern:** RESTful (Stateless).
- **Endpoint:** `POST /api/sync`.
- **Payload:** `{ "job_description": "...", "user_profile": {...}, "resume_template_id": "clean_modern" }`.
- **Response:** `{ "latex_source": "...", "optimization_log": [...] }`.
- **Reasoning:** Statelessness allows easy scaling on serverless functions (Vercel/AWS Lambda).

### Data Formats and Standards

**Resume Data (JSON):**

- **Standard:** JSON Resume Schema (modified).
- **Transformation:** JSON -> Jinja2 Context -> LaTeX String.
- **Tool:** **Jinja2** because we are _filling templates_, not programmatically generating layout (which PyLaTeX does).
- **Specific Config:** Jinja2 environment must use `variable_start_string='VAR{'` and `block_start_string='BLOCK{'` to coexist with LaTeX's `{ }` syntax.

**Vector Metadata (Pinecone Scheme):**

- **Structure:** Flat key-value pairs for filtering.
  - `skills`: List of strings `["Python", "Project Management"]`.
  - `role_category`: String `"Engineering"`.
  - `experience_level`: Integer `5` (Years).
- **Why:** Enables queries like "Find my best bullet points for _Project Management_".

### System Interoperability Approaches

**Overleaf Interop (The "Bridge"):**

- **Constraint:** No free API to "push" files.
- **Pattern:** **"Pull from Git"**.
  1.  Sync Engine generates `.tex`.
  2.  Pushes to user's `resume-sync` GitHub repo (via GitHub API).
  3.  User clicks "New Project from GitHub" in Overleaf (or uses Premium sync).
- **Alternative (MVP):** `encoded_snip` URL parameter (GET request) if the resume is under ~2KB URL limit. If larger, we must use the Git/S3 workaround.

### Integration Security Patterns

**n8n Webhook Security:**

- **Pattern:** Shared Secret Token.
- **Header:** `X-Sync-Auth: <secret_match>`.
- **Why:** Prevents unauthorized people from triggering your vector ingestion workflow.

---

<!-- Content will be appended sequentially through research workflow steps -->
