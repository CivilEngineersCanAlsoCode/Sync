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
    "output/planning-artifacts/product-brief-Resume-personalisation-2026-02-11.md",
    "context/technical-sync_architecture-research-2026-02-11.md",
    "context/advanced-elicitation-Sync-2026-02-11.md",
    "context/prd.md",
    "context/Context.md",
    "context/product-brief-Sync-2026-02-11.md",
    "context/user-preferences-tracker.md",
    "context/self-improvement-protocol.md",
    "context/bmad-orchestrator-governance.md",
    "context/enterprise-quality-gates.md",
    "context/index.md",
    "context/Untitled-1",
    "docs/governance/editorial-review-Context.md",
  ]
classification:
  projectType: "Self-Hosted Web App"
  domain: "Career & Productivity"
  complexity: "Medium"
  projectContext: "Greenfield/Brownfield Hybrid"
documentCounts:
  briefCount: 2
  researchCount: 2
  brainstormingCount: 0
  projectDocsCount: 1
workflowType: "prd"
---

# Product Requirements Document - Resume personalisation (Sync)

**Author:** satvik
**Date:** 2026-02-11

## Executive Summary

**Sync** ek self-hosted, privacy-first Resume Builder hai jo developers ke liye design kiya gaya hai. Ye AI (Gemini/Local LLM) ka upyog karke resume tailoring ko fast (< 2 mins) aur professional (LaTeX) banata hai, bina kisi subscription fees ya data privacy risk ke. Iska core engine Mac M1/M2/M3 chips ke liye optimized hai.

## Kamyabi ke Maane (Success Criteria)

### User Success

- **Precision Tailoring:** Resume bullets LaTeX mein 1.0 se 2.0 lines ke beech honi chahiye (na spillover, na chhoti lines).
- **Interactive Experience:** Multi-turn Q&A jo dialogue jaisa lage (sirf one-shot nahi).
- **Data Sovereignty:** Saara data aur tailoring history sirf local machine par save ho.

### Technical Success

- **Rate Limit Compliance:** AI API calls ke beech mein sahi delays taaki error na aaye.
- **Visual Perfectness:** Ek aisa algorithm jo character-width calculate karke perfect lines banaye.
- **Template Fidelity:** 100% fixed professional one-page LaTeX template ka use.

### Measurable Outcomes

- **North Star:** 100% resume exports strictly one-page honge.
- **Reliability:** n8n Vector DB aur local files ko bina data loss ke update karega.

## Project ka Daayra (Product Scope)

### MVP - Minimum Viable Product (Phase 1)

- **Multi-Turn Tailoring:** Step-by-step editing loop (Parse -> Question -> Answer -> Rewrite).
- **Local Persistence:** Answers local SQLite mein save honge, aur Vector updates Pinecone/n8n ke through.
- **Fixed One-Page Template:** Rigid layout jisme sections fixed honge.
- **Priority Sequencing:** AI sabse relevant projects ko page ke upper half mein rakhega.
- **Line-Width Algorithm:** LaTeX ki width ke mutabiq content ko limit karne wala logic.
- **Overleaf Bridge:** Final code ko Overleaf par bhejne ka tareeka via Secure POST.

### Aage ki Soch (Growth Features)

- **Phase 2:** Local LaTeX Engine (Mac Mini par PDF render) aur Local Networking (LAN Access).
- **Phase 3:** Full Local LLM Integration (Ollama) aur Browser Extension for 1-click job clipping.

## User Journeys (Yatra)

### Rohan ki "Tailoring" Kahani

Rohan gap identify karta hai, AI mandatory sawal poochta hai.

- **Match Milne Par:** Rohan context deta hai, AI line-width algorithm se perfect 1.8 line ka bullet banata hai.
- **Gap Hone Par:** Rohan kehta hai "This is new for me", AI halluncinate nahi karta aur agle priority item par chala jata hai.

### Sarah ki "Career Translation" Kahani

Sarah apni career stream badal rahi hai. AI uske puraane projects se transferable skills extract karke naye JD ke liye "Translate" karta hai, aur Sarah se verification mangta hai har step pe.

## Technical Zaruratein aur Constraints

### Privacy aur Compliance

- **Local-First:** 100% data machine par hi rahega. Koi telemetry nahi.
- **DB Backups:** Weekly automatic database backup (SQLite file copy to backup folder).

### Architecture Constraints

- **PC App Focus:** Ye sirf Desktop/M1 Mac ke liye optimize hoga.
- **Direct AI Calls:** Fast processing ke liye frontend direct AI model ko call karega. n8n sirf data plumbing sambhalega.
- **Tech Stack:** Docker Compose based environment, optimized for Apple Silicon.

### Risk Mitigations

- **Rate Limit Resilience:** API queuing aur back-off logic.
- **Context Grounding:** AI prompts local history aur job description facts par based honge.

## Nayi Soch (Innovation)

- **"Precision-Fit" Algorithm:** Layout-aware tailoring jo LaTeX line-balancing guarantee karta hai.
- **"One-Page" Gravity Logic:** AI-driven re-ordering jo impactful matches ko top par rakhta hai.

## Functional Requirements (Capability Contract)

### 1. Job Management

- **FR1:** User job ki details (Title, Company, JD text) manually save kar sakta hai.
- **FR2:** User apni saved jobs ki list manage kar sakta hai.

### 2. Resume Parsing & Profile

- **FR3:** User base resume PDF upload karke projects extract kar sakta hai.
- **FR4:** User apne profile data ko manually edit ya add kar sakta hai.

### 3. Precision Tailoring Loop

- **FR5:** AI user se project-specific "Mandatory Probing Questions" pooch sakta hai.
- **FR6:** User ke answers ke basis par AI testable bullet points draft karega.
- **FR7:** AI bullet points ko automatically re-order (Gravity Logic) karega.

### 4. Layout Logic

- **FR8:** System har bullet ki width LaTeX font ke mutabiq check karke 1.0-2.0 lines ke beech rakhega.

### 5. Export aur Admin

- **FR9:** Saara data locally SQLite/CSV mein store hoga aur weekly backup hoga.
- **FR10:** User final resume ko direct Overleaf par export kar sakta hai.

## Non-Functional Requirements (Maap-Dand)

### 1. Performance

- **Response Time:** JD processing aur initial tailoring questions **< 30 seconds** mein hone chahiye.
- **Total Loop:** Job link se final LaTeX tak ka waqt **< 2 minutes** hona chahiye.

### 2. Privacy & Security

- **Offline Integrity:** Browser-based data leak se bachne ke liye strict local-only routing.
- **Data Residency:** No personal data (PII) to be sent to external servers except AI APIs.

### 3. Reliability

- **State Persistence:** Multi-turn session ke beech mein refresh karne par data loss nahi hona chahiye.
- **Graceful Degradation:** AI API down hone par user ko informative message milna chahiye.
