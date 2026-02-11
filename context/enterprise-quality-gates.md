---
trigger: model_decision
description: Enforces enterprise-grade quality standards. Trigger ONLY when the user explicitly requests a review, validation, or Quality Gate check, or when finalizing a major artifact.
---

# Enterprise Quality Gates Rule

## Purpose

This rule enforces specific quality standards for code, architecture, and documentation. **It is an on-demand validator**, not an always-on blocker.

## When to Apply

Apply these gates ONLY in the following scenarios:

1.  **User Request:** User asks "Is this ready?", "Review this", or runs `/quality-gate-review`.
2.  **Phase Completion:** When finalizing a major artifact (e.g., "Final Architecture", "Production Code").
3.  **Explicit Trigger:** User invokes a specific quality check.

**Do NOT apply these gates to:**

- Drafts, prototypes, or "Quick Dev" tasks.
- Intermediate steps in a workflow (unless critical).

## The Gates

### Gate 1: Documentation Quality

- **Clarity:** Specific, testable requirements.
- **Completeness:** No "TBD" in final docs.
- **Consistency:** Consistent terminology.

### Gate 2: Architecture Quality

- **Scalability:** Strategy for growth defined.
- **Security:** Auth/Authz defined. No hardcoded secrets.
- **API Contract:** Defined schemas.

### Gate 3: Code Quality

- **Readability:** Clean naming, modular functions.
- **Error Handling:** Explicit handling, no silent failures.
- **No Dead Code:** Clean artifacts.
- **Secrets:** Environment variables only.

### Gate 4: Testing Quality (Delivery Phase)

- **Unit Tests:** Critical business logic covered.
- **Integration Tests:** Happy/Sad paths for APIs.

### Gate 5: Security Quality

- **Validation:** Input sanitization.
- **Dependencies:** No known vulnerabilities.

## Enforcement Mechanism

When triggered:

1.  Evaluate the artifact against relevant gates.
2.  Report status: `[Quality Gates: ✅ Docs | ⚠️ Security (Needs Auth) | ⏳ Tests (Pending)]`
3.  Block "Final" status until critical issues are resolved (unless overridden by user).
