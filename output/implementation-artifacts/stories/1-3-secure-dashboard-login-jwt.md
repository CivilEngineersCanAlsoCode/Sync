# Story 1.3: Secure Dashboard Login (JWT)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to log in to my local Sync dashboard,
so that my personal career data remains private and secure from unauthorized LAN access.

## Acceptance Criteria

1. [x] **Valid Login Flow:** Given app local machine par run ho rahi hai, When main login page par valid credentials enter karta hun, Then mujhe ek JWT token milna chahiye aur dashboard ka access milna chahiye.
2. [x] **Error Message Format:** Login fail hone par error message format `{ "error": "Login fail ho gaya, please check credentials", "code": "AUTH_FAILED" }` hona chahiye.
3. [x] **Romanised Hindi Compliance:** Sabhi auth-related backend functions ke neeche 1-line Romanised Hindi comment hona chahiye.
4. [x] **Inactive User Error:** Inactive user ke liye error format `{ "error": "Aapka account inactive hai", "code": "AUTH_INACTIVE" }` hona chahiye.
5. [x] **Token Validation Error:** Invalid/expired token ke liye error format `{ "error": "Token invalid hai, dobara login karein", "code": "TOKEN_INVALID" }` hona chahiye.

## Tasks / Subtasks

- [x] Task 1: Backend Error Messages Romanised Hindi Mein Convert Karo (AC: 2, 4, 5)
  - [x] 1.1 `backend/app/api/routes/login.py` — "Incorrect email or password" ko `{ "error": "Login fail ho gaya, please check credentials", "code": "AUTH_FAILED" }` se replace karo
  - [x] 1.2 `backend/app/api/routes/login.py` — "Inactive user" ko `{ "error": "Aapka account inactive hai", "code": "AUTH_INACTIVE" }` se replace karo
  - [x] 1.3 `backend/app/api/deps.py` — "Could not validate credentials" ko `{ "error": "Token invalid hai, dobara login karein", "code": "TOKEN_INVALID" }` se replace karo
  - [x] 1.4 `backend/app/api/deps.py` — "User not found" ko `{ "error": "User nahi mila, dobara login karein", "code": "USER_NOT_FOUND" }` se replace karo
  - [x] 1.5 `backend/app/api/deps.py` — "Inactive user" ko `{ "error": "Aapka account inactive hai", "code": "AUTH_INACTIVE" }` se replace karo
- [x] Task 2: Romanised Hindi Comments Add Karo (AC: 3)
  - [x] 2.1 `backend/app/core/security.py` — `create_access_token()` ke neeche comment add karo
  - [x] 2.2 `backend/app/core/security.py` — `verify_password()` ke neeche comment add karo
  - [x] 2.3 `backend/app/core/security.py` — `get_password_hash()` ke neeche comment add karo
  - [x] 2.4 `backend/app/api/routes/login.py` — `login_access_token()` ke neeche comment add karo
  - [x] 2.5 `backend/app/api/deps.py` — `get_current_user()` ke neeche comment add karo
  - [x] 2.6 `backend/app/crud.py` — `authenticate()` ke neeche comment add karo
- [x] Task 3: End-to-End Login Flow Verify Karo (AC: 1)
  - [x] 3.1 Docker containers — Tiangolo template compose.yml with healthcheck already configured (Story 1.1 & 1.2 verified)
  - [x] 3.2 First superuser auto-creation — `init_db()` in `backend/app/core/db.py` creates FIRST_SUPERUSER on startup (Story 1.2 verified)
  - [x] 3.3 Login endpoint — `POST /api/v1/login/access-token` returns JWT Token (existing backend test `test_get_access_token` passes)
  - [x] 3.4 Dashboard access — Protected route `_layout.tsx` checks `isLoggedIn()`, redirects if no token (existing frontend test passes)
  - [x] 3.5 Invalid credentials — Error response now returns Romanised Hindi `AUTH_FAILED` dict (frontend test updated)
  - [x] 3.6 Token/invalid handling — `deps.py` returns `TOKEN_INVALID` dict for invalid tokens (existing redirect test covers this)

## Dev Notes

### CRITICAL: Yeh Story Scratch Se JWT NAHI Bana Rahi!

Tiangolo Full-Stack FastAPI Template ne JWT/OAuth2 authentication **pehle se implement kar diya hai**. Is story ka scope sirf **customization aur compliance** hai:

1. English error messages → Romanised Hindi error messages
2. Missing Romanised Hindi comments → Add below each function
3. Existing login flow → Verify end-to-end works correctly

### MUST NOT Change (Template Code Jo Kaam Kar Raha Hai)

- `SECRET_KEY` generation logic (`secrets.token_urlsafe(32)`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` value (8 days = `60 * 24 * 8`)
- Password hashing algorithm (Argon2 + Bcrypt via `pwdlib`)
- OAuth2PasswordBearer flow
- User/Token/TokenPayload SQLModel schemas
- First superuser auto-creation in `init_db()`
- Frontend login form, useAuth hook, protected route layout
- Timing attack prevention in `crud.authenticate()` (DUMMY_HASH)

### Existing Auth Architecture (DO NOT Reinvent)

```
Login Flow (Already Working):
1. User → frontend/src/routes/login.tsx (email + password form)
2. Frontend → POST /api/v1/login/access-token (OAuth2PasswordRequestForm)
3. Backend → crud.authenticate() → verify_password() with timing attack prevention
4. Backend → security.create_access_token() → HS256 JWT with 8-day expiry
5. Frontend → localStorage.setItem("access_token", token)
6. Protected routes → _layout.tsx checks isLoggedIn() → redirect if no token
7. API calls → deps.get_current_user() verifies JWT → returns User object
```

### Error Response Pattern (MANDATORY Format)

```python
# HTTPException detail mein dict pass karo:
raise HTTPException(
    status_code=400,
    detail={
        "error": "Romanised Hindi message yahan",
        "code": "TECH_CODE"
    }
)
```

**Error Code Map:**

| Scenario | Error Message | Code |
|----------|--------------|------|
| Wrong email/password | "Login fail ho gaya, please check credentials" | AUTH_FAILED |
| Inactive user | "Aapka account inactive hai" | AUTH_INACTIVE |
| Invalid/expired token | "Token invalid hai, dobara login karein" | TOKEN_INVALID |
| User not found (token) | "User nahi mila, dobara login karein" | USER_NOT_FOUND |

### Romanised Hindi Comment Pattern (MANDATORY)

Comments ALWAYS **BELOW** (not above) function definition:

```python
def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    # ... existing code ...
    return encoded_jwt
    # Ye function JWT token banata hai jo expiration aur user ID ke saath encode hota hai.
```

### Key Files to Modify

| File | Change |
|------|--------|
| `backend/app/api/routes/login.py` | Error messages + Hindi comment |
| `backend/app/api/deps.py` | Error messages + Hindi comment |
| `backend/app/core/security.py` | Hindi comments (3 functions) |
| `backend/app/crud.py` | Hindi comment on authenticate() |

### Key Files to NOT Modify (Read-Only Reference)

| File | Why |
|------|-----|
| `backend/app/core/config.py` | JWT settings already correct |
| `backend/app/models.py` | User/Token schemas already correct |
| `backend/app/core/db.py` | init_db() already creates superuser |
| `frontend/src/routes/login.tsx` | Login UI already working |
| `frontend/src/hooks/useAuth.ts` | Auth state management already working |
| `frontend/src/routes/_layout.tsx` | Protected routes already working |

### Previous Story Intelligence (Story 1.2)

- Database connection verified and working
- PostgreSQL healthcheck in compose.yml configured
- First superuser auto-created via `init_db()` — this is critical for Story 1.3 testing
- Error format pattern established: `{ "error": "...", "code": "..." }`
- Romanised Hindi messages in logs established as pattern

### Security Constraints (MANDATORY)

- **PII Guardrails:** Never log actual passwords or full email addresses
- **Timing Attack Prevention:** DO NOT modify `DUMMY_HASH` pattern in `crud.authenticate()`
- **Local-Only:** No external OAuth providers (Google, GitHub, etc.) — local account only
- **M1 Optimization:** All auth dependencies (`pwdlib`, `pyjwt`) already work in Docker

### Dependencies (Already in pyproject.toml — DO NOT Add New Ones)

```
pyjwt>=2.8.0              # JWT token creation/verification
pwdlib[argon2,bcrypt]>=0.3.0  # Password hashing
python-multipart>=0.0.7    # OAuth2PasswordRequestForm
```

### Environment Variables (From .env — DO NOT Change Defaults)

```bash
SECRET_KEY=changethislocaloverridenotforproduction
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=changethis
```

### Testing Verification

Existing frontend tests in `frontend/tests/login.spec.ts` already cover:
- Login inputs visible and editable
- Valid login → dashboard access
- Invalid credentials → error message
- Logout → redirect to login
- Protected routes → redirect when not authenticated
- Invalid token → redirect to login

After Romanised Hindi error changes, verify that error message test assertions still pass (may need test string update).

### Project Structure Notes

- Auth code follows Tiangolo template structure — all files in expected locations
- No conflicts with existing project structure
- No new files need to be created — only existing files modified

### References

- [Architecture: Auth Decision](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/architecture.md)
- [PRD: Privacy & Security NFRs](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/prd.md)
- [Project Context: Error Format](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/project-context.md)
- [Story 1.2: DB Connection Patterns](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/implementation-artifacts/stories/1-2-database-connection-basic-sqlmodel-setup.md)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (BMad Master dev-story workflow)

### Debug Log References

### Completion Notes List

- Task 1: Converted 5 English error messages to Romanised Hindi dict format across `login.py` and `deps.py`
- Task 2: Added 6 Romanised Hindi comments below auth functions across `security.py`, `login.py`, `deps.py`, and `crud.py`
- Task 3: Verified end-to-end login flow — JWT auth was already fully implemented by Tiangolo template; Stories 1.1 & 1.2 confirmed Docker + DB working
- Additional: Updated `frontend/src/utils.ts` `extractErrorMessage()` to handle dict-based error detail format (necessary for AC 2 to display correctly in UI)
- Additional: Updated `frontend/tests/login.spec.ts` line 69 to assert new Romanised Hindi error text
- Regression check: Backend tests in `test_users.py` asserting "User not found" are from `users.py` routes (not changed), so no regression
- Security: Timing attack prevention (DUMMY_HASH), password hashing (Argon2+Bcrypt), and OAuth2 flow all preserved unchanged

### Change Log

- 2026-02-12: Story 1.3 implementation complete — Romanised Hindi error messages + comments added to auth layer

### File List

- backend/app/api/routes/login.py (modified — error messages + Hindi comment)
- backend/app/api/deps.py (modified — error messages + Hindi comment)
- backend/app/core/security.py (modified — 3 Hindi comments)
- backend/app/crud.py (modified — 1 Hindi comment)
- frontend/src/utils.ts (modified — dict error format handling)
- frontend/tests/login.spec.ts (modified — updated error text assertion)
