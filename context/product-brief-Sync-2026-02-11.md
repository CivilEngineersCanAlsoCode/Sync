---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
date: 2026-02-11
author: Satvik
---

# Product Brief: LinkRight

---

## MVP Scope

### Core Features (Phase 1)

- **Job Tracker:** Simple dashboard to add Job Company/Role/Link.
- **Resume Parser:** Extract text from user's existing PDF to create their "Base Profile".
- **The "Sync" Engine:** Gemini generates the targeted bullet points.
- **Memory Integration:** n8n workflow to ingest user answers/projects into Pinecone (building the vector store).
- **LaTeX Generator:** Converts tailored content into a high-quality LaTeX template.
- **Overleaf Integration:** "Open in Overleaf" button (POST API) for immediate editing.

### Out of Scope (Saved for Phase 2)

- **Advanced Retrieval (RAG):** (Uses stored vectors to suggest answers - Phase 2).
- **GitHub Actions Automation:** (Phase 2).
- **Chrome Extension:** (Phase 2).
- **Cover Letters:** (Phase 2).
- **Multiple Templates:** (MVP launches with 1 standard template).

### MVP Success Criteria

- **Functionality:** "Open in Overleaf" button works 100% of the time.
- **Speed:** Total time from "Job URL" to "Valid Overleaf Project" < 2 minutes.
- **Data Integrity:** 100% of user answers are successfully stored in Pinecone via n8n.

### Future Vision

A fully automated "Career Agent" that learns from every application. Eventually, the user just pastes a link, and the agent retrieves the perfect experience from history, generates the resume, compiles it via GitHub, and even writes the cover letter—all in seconds.

## Executive Summary

**Sync** is an AI-powered resume personalization tool designed to help job seekers tailor their resumes for specific job openings with minimal effort and cost. By leveraging Gemini's cost-effective API, Sync offers a "free-forever" model for core personalization features, democratizing access to high-quality, ATS-optimized resumes. The platform focuses on a streamlined workflow: tracking job applications, gathering specific experience details via AI-generated questions, and producing a perfectly aligned resume in standard formats.

---

## Core Vision

### Problem Statement

Job seekers struggle to customize their resumes for every single application. The process is time-consuming, repetitive, and often ineffective. Existing tools are either expensive, complex, or require manual rewriting. Candidates often fail to highlight their most relevant experience because they can't bridge the gap between their general history and specific job requirements.

### Problem Impact

- **Missed Opportunities**: Qualified candidates get rejected by ATS or recruiters because their resume doesn't match keywords/skills.
- **Time Waste**: Hours spent manually tweaking resumes for each application.
- **Financial Barrier**: Professional resume services and premium builders are costly.

### Why Existing Solutions Fall Short

- **Cost**: Tools like FlowCV are great but restrict advanced features (like AI analysis or multiple versions) behind paywalls or limits.
- **Generic AI**: Many AI writers just generate generic fluff without deeply aligning with the specific job description.
- **Disconnected Flow**: Resume building is often separate from job application tracking.

### Proposed Solution: Sync

A **Job-First, LaTeX-Native Resume Builder**.

1.  **Tracker-First Approach**: Users start by saving a job opening (Company, Role, Link).
2.  **AI-Driven Context Extraction**: The system analyzes the job description AND the user's base resume.
3.  **LaTeX Engine**: Instead of HTML/CSS web layout, Sync generates high-quality **LaTeX code**.
4.  **Overleaf & GitHub Integration**:
    - **Editing**: Users can open their resume directly in **Overleaf** for pixel-perfect fine-tuning.
    - **Automation**: Uses **GitHub Actions** to automatically compile the final PDF whenever changes are made, keeping the process free and serverless.
5.  **Active Personalization**: The AI asks _specific_ probing questions to refine the LaTeX content before compilation.

### Key Differentiators

- **Typesetting Quality**: LaTeX guarantees professional, ATS-friendly formatting that HTML-to-PDF converters often miss.
- **Developer-Friendly Workflow**: Git-backed resumes allow for version control and automation.
- **"Interview" Mode**: The personalization happens via a dynamic Q&A modal.
- **Price**: "Almost Free" (Uses user's GitHub/Overleaf free tiers + low-cost Gemini API).

---

## Strategic Roadmap

### Phase 1: The Personalization Engine (MVP)

_Focus: Single-player utility with Overleaf Handoff._

- **Core Input**: Parse existing resume -> Convert to structured LaTeX.
- **The "Sync" Flow**: AI aligns content -> Updates `.tex` file.
- **Output**: "Open in Overleaf" button (via POST API) for manual compilation/editing.

### Phase 2: The Job Application Hub & Automation

_Focus: GitHub Actions Pipeline._

- **Git Sync**: Sync connects to user's GitHub repo.
- **Auto-Compile**: GitHub Actions workflow compiles PDF on every update.
- **Kanban Board**: Applications link to specific Git branches/commits.
- **Chrome Extension**: "Clip" jobs directly from LinkedIn.

### Phase 3: Commercial Product

_Focus: Scaling and Monetization._

- **Freemium Model**: Advanced templates, analytics, or bulk-processing.
- **Advanced Manual Editor**: Full drag-and-drop resume builder with granular layout controls (parity with tools like FlowCV).
- **Community/Social**: Share successful templates or anonymized bullet points.

---

## Target Users

### Primary Users

**1. The "Volume" Applicant (Rohan)**

- **Context:** Recent grad or Junior dev. Applying to 20-50 jobs/week.
- **Pain:** "I know I need to customize my resume, but I can't write 50 different versions. I just send the same generic one and get rejected."
- **Goal:** Quantity with Quality. Wants to get past the ATS without spending hours.

**2. The Career Pivoter (Sarah)**

- **Context:** Experienced Marketing Manager moving into Product Management.
- **Pain:** "My resume screams 'Marketing', but I have the skills for PM. I don't know how to translate my experience so recruiters see my potential."
- **Goal:** Re-framing. Needs the "Interview Mode" to help her extract and highlight transferrable skills.

### Secondary Users

**Recruiters (The Audience)**

- They don't use the tool, but the output must serve them.
- **Requirement:** Clean, standard formatting (no fancy columns/graphics that break ATS). Skimmable.

### User Journey (The "Sync" Loop)

1.  **Capture**: User sees a job on LinkedIn -> Clicks "Sync This Job".
2.  **Analyze**: System contrasts Job Description vs. User Profile.
3.  **Bridge**: System asks: _"You managed a budget in your last role. This job requires 'P&L ownership'. Did you handle profit/loss?"_
4.  **Refine**: User answers "Yes, I did X." System rewrites the bullet point to match the JD's language.
5.  **Submit**: User downloads a perfectly tailored PDF in 2 minutes.

---

## Success Metrics

### User Success (The "Value" Signal)

- **Time-to-Export:** User should be able to go from "Job Link" to "PDF Download" in **< 2 minutes**.
- **Editor Engagement:** % of auto-generated bullet points accepted without manual editing. (Measures Gemini's quality).

### Business Objectives (The "Viability" Signal)

- **Cost Efficiency:** Average API Cost per Resume **< $0.01** (Leveraging Gemini Flash/Caching).
- **Retention:** % of users who return to "Sync" a second job within 7 days.

### Key Performance Indicators (KPIs)

- **North Star:** **# of Synced Applications** (Jobs added + Resume generated).
- **Growth:** Monthly Active Users (MAU).
