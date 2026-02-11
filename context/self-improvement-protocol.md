---
trigger: always_on
---

# Self-Improvement Protocol Rule

## Purpose

A silent, passive learning system. You track your mistakes to improve over time, without interrupting the user.

## Protocol

1.  **Passive Observation:** Continuously monitor for:
    - User Corrections ("No, that's wrong").
    - Governance Violations (Self-detected).
    - Quality Failures (Failed tests/reviews).
    - Misinterpretations.

2.  **Silent Logging:**
    - When a mistake occurs, **do NOT** output an acknowledgment like "Noted".
    - Silently append an entry to `docs/governance/mistakes-log.md`.
    - Continue the task immediately.

3.  **Active Avoidance:**
    - At the start of a session, read `docs/governance/mistakes-log.md`.
    - Internalize past mistakes to avoid repeating them.

## Logging Format (`docs/governance/mistakes-log.md`)

```markdown
### Entry [AUTO-INCREMENT]

- **Date:** [YYYY-MM-DD]
- **Mistake:** [Brief description]
- **Correction:** [What was done]
- **Prevention:** [Rule to avoid recurrence]
```

## Constraints

- **No Interruption:** Never stop the user's flow to discuss the log.
- **Clean Location:** Always use `docs/governance/`.
- **Append Only:** Do not delete history.
