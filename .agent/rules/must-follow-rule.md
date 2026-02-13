---
trigger: always_on
---

- Always give responses which are 100 words or less inside the chat while explaining to user anything following the pyramid principle of consulting with 3\*3 structure
- Always read Gemini.md before writing any code
- Always update Gemini.md file after writing any code with the exact learnings & mistakes following the protocol below.
- Always ensure all above rules are followed, never break any of the above rules

# Gemini Learning & Mistake Protocol

Every time a mistake is made, it MUST be documented here using the following template to ensure zero repetition.

## 📋 Mistake Documentation Template

```markdown
### [Complexity/Category]: [Short Description]

- **Root Cause**: [Detailed explanation of why the error occurred]
- **Correction**: [The specific code or config change that fixed it]
- **Prevention Action**: [Actionable checklist or rule to follow in the future]
```

---

## 🚫 Mistakes That Must NEVER Repeat

### [Infrastructure]: Port Mapping Inconsistency

- **Root Cause**: Docker-compose mapped internal port 80 to host 5173, but the Vite app was actually serving on 5173 inside the container.
- **Correction**: Updated `compose.override.yml` to map `5173:5173`.
- **Prevention Action**: Always verify the `EXPOSE` port in `Dockerfile` and the app's config before defining `ports` in `docker-compose.yml`.

### [Frontend]: ReferenceError in useAuth.ts

- **Root Cause**: The `error` variable was used in the component logic without being destructured from the `useQuery` return object.
- **Correction**: Added `error` to the destructuring list of `useQuery`.
- **Prevention Action**: Run a quick lint check or verify variable visibility before using data returned from hooks.

### [Network]: Hardcoded Localhost API URL

- **Root Cause**: The frontend was hardcoded to call `localhost:5173` instead of the backend service on `localhost:8000`.
- **Correction**: Updated `frontend/src/main.tsx` to set `OpenAPI.BASE` via `import.meta.env.VITE_API_URL`.
- **Prevention Action**: Never hardcode URLs; always use environment variables and verify `OpenAPI.BASE` during initialization.

### [Testing]: Missing Vitest JSDOM Polyfills

- **Root Cause**: Radix UI components failed in tests because JSDOM lacks certain browser APIs like `ResizeObserver`.
- **Correction**: Added polyfills for `ResizeObserver`, `PointerEvent`, and `scrollIntoView` in `src/setupTests.ts`.
- **Prevention Action**: Before testing UI libraries (Radix, Shadcn), ensure `setupTests.ts` includes common browser API polyfills.

### [Database]: Data Migration Constraint Violation

- **Root Cause**: Attempted to add a `NOT NULL` column (`token_version`) to a table that already had existing rows.
- **Correction**: Sequential migration: 1) Add as nullable, 2) Set defaults via `UPDATE`, 3) Alter to `NOT NULL`.
- **Prevention Action**: For any new column in an existing table, always assume data exists and use the 3-step nullable-to-not-null pattern.

### [E2E]: Playwright Concurrent Session Conflict

- **Root Cause**: Single-context tests shared the same storage state, preventing simulation of multi-user/concurrent login scenarios.
- **Correction**: Used `browser.newContext()` to isolate sessions for different users within the same test.
- **Prevention Action**: Use isolated contexts for any test requiring more than one distinct user state.

### [Security]: Shell Expansion / Secret Leaks

- **Root Cause**: Special characters (e.g., `!`) in passwords caused `curl` or shell scripts to hang or leak data without proper quoting.
- **Correction**: Enforce single quotes for shell variables or use simple ASCII for test credentials.
- **Prevention Action**: Always wrap shell command inputs in single quotes (`'`) and avoid special characters in default test passwords.

### [Logic]: Performance/Timing Attack Bias

- **Root Cause**: Misidentified authentication stalls as "Argon2 hangs" when the `user` table was actually empty, triggering `DUMMY_HASH` logic.
- **Correction**: Verify data presence (`SELECT count(*)`) before diagnosing performance bottlenecks.
- **Prevention Action**: Check DB state first. Remember that `DUMMY_HASH` verification is a security feature (constant time), not a bug.
