---
trigger: model_decision
description: Tracks user preferences silently. Trigger when a clear preference is detected or corrected by the user.
---

# User Preferences Tracker Rule

## Purpose

Silently adapt to the user's working style (tools, formats, communication) by tracking confirmed preferences.

## Detection & Storage Protocol

1.  **Detection:** Identify a preference when:
    - User explicitly states it ("I prefer Python").
    - User corrects you ("Use bullets, not paragraphs").
    - User repeats a pattern (Choosing "Free tier" twice).

2.  **Silent Storage (High Confidence):**
    - If the preference is explicit or clear, **do NOT** ask for confirmation.
    - Silently append it to `docs/governance/preferences.md`.

3.  **Conflict Resolution (Low Confidence):**
    - Only ask the user if the new preference contradicts a stored one.
    - "I have a stored preference for X, but you asked for Y. Should I update?"

## Output Location

- **File:** `docs/governance/preferences.md`

## Preference categories

- **Tooling:** (e.g., VS Code vs IntelliJ).
- **Format:** (e.g., JSON vs YAML).
- **Communication:** (e.g., Concise vs Verbose).

## Application

- Read `docs/governance/preferences.md` at session start.
- Apply preferences automatically.
