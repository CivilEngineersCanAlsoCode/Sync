---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  [
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
  ]
date: 2026-02-11
author: satvik
project_name: Resume personalisation (Sync)
---

# Product Brief: Resume personalisation

## Executive Summary

**Sync** ek self-hosted, privacy-first Resume Builder hai jo developers ke liye bana hai. Ye AI (Gemini/Local LLM) ka use karke resume tailoring ko fast (< 2 mins) aur professional (LaTeX) banata hai. Iska focus poori tarah privacy aur simplicity par hai bina kisi SaaS subscription ke.

---

## Core Vision

### Problem Statement

Job seekers ko har application ke liye resume customize karne mein bohot waqt lagta hai. Repetitive kaam hone ki wajah se log generic resume bhej dete hain, jisse ATS unhe reject kar deta hai. Saath hi, privacy ka risk hota hai kyunki resume data cloud servers par save hota hai.

### Proposed Solution: Sync

Ek **Job-First, LaTeX-Native Resume Builder** jo local Mac Mini par chalta hai.

1. **Tracker-First:** Pehle job bachao, fir tailoring shuru karo.
2. **AI Analysis:** AI se step-by-step Q&A karke specific gaps bharo.
3. **Overleaf Sync:** Perfect typesetting ke liye direct Overleaf export.

### Key Differentiators

- **Precision:** Bullets ki line-length LaTeX ke mutabiq perfect (1-2 lines).
- **Privacy:** 100% data residency aapke machine par.
- **Direct AI:** Faster response ke liye direct model calls (no middleman delay).

---

## Target Users

1. **Rohan (Volume Applicant):** Jise kam waqt mein zyada quality resumes chahiye.
2. **Sarah (Career Pivoter):** Jise apni puraani skills ko naye role ke liye "translate" karna hai.

---

## Success Metrics

- **Efficiency:** Job link se resume export tak sirf 2 minute.
- **Quality:** AI ke banaye bullets 80% bina correction ke accept ho jayein.
- **Privacy:** Data machine se bahar na jaye.

---

## MVP Scope

- **Interactive Tailoring:** Multi-turn loop jisme user mandatory input deta hai.
- **Local persistence:** Answers CSV/SQLite mein save honge.
- **Priority Logic:** Sabse relevant content top half mein automatically place hoga.
- **Weekly Backup:** Database ka automatic weekly backup setup.
- **PC-Only App:** Sirf desktop/dashboard focus, mobile out of scope.

---

## Future Vision

- **Local AI:** Gemini ki jagah Llama 3 (Ollama) locally chalaana.
- **Headless PDF:** Bina Overleaf ke hi machine par PDF create karna.
