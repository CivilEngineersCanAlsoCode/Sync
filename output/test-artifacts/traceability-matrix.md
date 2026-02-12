# Requirements-to-Tests Traceability Matrix

**Epic:** Epic 1 - Full-Stack Project Foundation  
**Generated:** 2026-02-12T03:52:26+05:30  
**Gate Type:** Story  
**Decision Mode:** Deterministic

---

## Executive Summary

| Metric                        | Value       |
| ----------------------------- | ----------- |
| **Total Stories**             | 3           |
| **Total Acceptance Criteria** | 9           |
| **Criteria Covered**          | 3 (33.3%)   |
| **Criteria with Gaps**        | 6 (66.7%)   |
| **Total Tests Found**         | 6 E2E tests |
| **Gate Decision**             | **FAIL** ❌ |

---

## 🚨 Quality Gate Decision: FAIL

### Rationale

- **Critical Coverage Gaps:** 6 out of 9 acceptance criteria (66.7%) lack test coverage
- **Risk Score:** 9 (Probability: 3, Impact: 3) - **CRITICAL BLOCKER**
- **Missing Tests:** Database connection validation, Docker environment setup, JWT token generation

### Recommendations

1. 🚨 **IMMEDIATE ACTION:** Create tests for Story 1.1 (Docker setup) and Story 1.2 (Database connection)
2. ⚠️ **HIGH PRIORITY:** Add JWT token validation tests for Story 1.3
3. 📋 **COVERAGE TARGET:** Achieve minimum 80% coverage for P0 acceptance criteria before release

---

## Story 1.1: Core Environment & Docker Apple Silicon Setup

**Priority:** P0 (Critical - Foundation)  
**Status:** ❌ **NO COVERAGE**

### Acceptance Criteria

| ID        | Criterion                                                                                              | Priority | Tests | Status |
| --------- | ------------------------------------------------------------------------------------------------------ | -------- | ----- | ------ |
| AC-1.1-01 | Docker containers (backend, frontend, postgres) start without architecture mismatch errors on M1/M2/M3 | P0       | None  | ❌ GAP |
| AC-1.1-02 | `docker-compose.yml` contains Romanised Hindi comment explaining configuration                         | P0       | None  | ❌ GAP |

### Coverage Gap Analysis

**Risk Score:** 9 (Probability: 3, Impact: 3)  
**Category:** TECH (Technical Infrastructure)  
**Impact:** Without Docker environment tests, deployment failures will only be discovered in production

**Mitigation Required:**

- Create E2E test: `tests/e2e/docker-setup.spec.ts`
- Validate container health checks
- Verify architecture compatibility (ARM64 for Apple Silicon)

---

## Story 1.2: Database Connection & Basic SQLModel Setup

**Priority:** P0 (Critical - Data Layer)  
**Status:** ❌ **NO COVERAGE**

### Acceptance Criteria

| ID        | Criterion                                                                                                                        | Priority | Tests | Status |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----- | ------ |
| AC-1.2-01 | "Database Connected" message appears in logs when Postgres is healthy                                                            | P0       | None  | ❌ GAP |
| AC-1.2-02 | Error message format `{ "error": "Database se connect nahi ho pa rahe hain...", "code": "DB_CONN_ERROR" }` on connection failure | P0       | None  | ❌ GAP |

### Coverage Gap Analysis

**Risk Score:** 9 (Probability: 3, Impact: 3)  
**Category:** DATA (Data Integrity)  
**Impact:** Database connection failures will cause silent data loss or application crashes

**Mitigation Required:**

- Create API test: `backend/tests/api/test_database_connection.py`
- Test happy path: successful connection
- Test unhappy path: connection failure with correct error format

---

## Story 1.3: Secure Dashboard Login (JWT)

**Priority:** P0 (Critical - Security)  
**Status:** ✅ **PARTIAL COVERAGE** (33.3%)

### Acceptance Criteria

| ID        | Criterion                                                                                           | Priority | Tests                                                                             | Status     |
| --------- | --------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------- | ---------- |
| AC-1.3-01 | User receives JWT token and dashboard access on valid login                                         | P0       | `frontend/tests/login.spec.ts` → "Log in with valid email and password"           | ✅ COVERED |
| AC-1.3-02 | Error message format `{ "error": "Login fail ho gaya...", "code": "AUTH_FAILED" }` on login failure | P0       | `frontend/tests/login.spec.ts` → "Log in with invalid password"                   | ✅ COVERED |
| AC-1.3-03 | Logged-out users cannot access protected routes                                                     | P0       | `frontend/tests/login.spec.ts` → "Logged-out user cannot access protected routes" | ✅ COVERED |

### Mapped Tests

#### ✅ Test: `frontend/tests/login.spec.ts` → "Log in with valid email and password"

- **Criteria:** AC-1.3-01
- **Level:** E2E
- **Priority:** P0
- **Coverage:** Validates JWT token generation and dashboard redirect

#### ✅ Test: `frontend/tests/login.spec.ts` → "Log in with invalid password"

- **Criteria:** AC-1.3-02
- **Level:** E2E
- **Priority:** P0
- **Coverage:** Validates error message format (Romanised Hindi)

#### ✅ Test: `frontend/tests/login.spec.ts` → "Logged-out user cannot access protected routes"

- **Criteria:** AC-1.3-03
- **Level:** E2E
- **Priority:** P0
- **Coverage:** Validates route protection after logout

### Additional Tests (Not Mapped to Epic 1)

The following tests exist but are not directly mapped to Epic 1 acceptance criteria:

- `frontend/tests/login.spec.ts` → "Inputs are visible, empty and editable" (UI validation)
- `frontend/tests/login.spec.ts` → "Log In button is visible" (UI validation)
- `frontend/tests/login.spec.ts` → "Forgot Password link is visible" (UI validation)
- `frontend/tests/login.spec.ts` → "Log in with invalid email" (Input validation)
- `frontend/tests/login.spec.ts` → "Successful log out" (Logout flow)
- `frontend/tests/login.spec.ts` → "Redirects to /login when token is wrong" (Security validation)

---

## Risk Assessment

### Critical Risks (Score = 9)

| Risk ID  | Category | Title                                   | Probability | Impact | Score | Status |
| -------- | -------- | --------------------------------------- | ----------- | ------ | ----- | ------ |
| RISK-001 | TECH     | Docker environment not validated        | 3           | 3      | 9     | OPEN   |
| RISK-002 | DATA     | Database connection failures undetected | 3           | 3      | 9     | OPEN   |

### Mitigation Plan

#### RISK-001: Docker Environment Not Validated

- **Owner:** DevOps Team
- **Deadline:** Before Story 1.1 completion
- **Action:** Create `tests/e2e/docker-setup.spec.ts` to validate container health

#### RISK-002: Database Connection Failures Undetected

- **Owner:** Backend Team
- **Deadline:** Before Story 1.2 completion
- **Action:** Create `backend/tests/api/test_database_connection.py` with happy/unhappy paths

---

## Test Coverage by Priority

| Priority | Total Criteria | Covered | Coverage % | Target %    | Status  |
| -------- | -------------- | ------- | ---------- | ----------- | ------- |
| P0       | 9              | 3       | 33.3%      | 90%         | ❌ FAIL |
| P1       | 0              | 0       | N/A        | 80%         | N/A     |
| P2       | 0              | 0       | N/A        | 60%         | N/A     |
| P3       | 0              | 0       | N/A        | Best effort | N/A     |

---

## Test Coverage by Level

| Level     | Tests Found | Criteria Covered | Notes                                       |
| --------- | ----------- | ---------------- | ------------------------------------------- |
| E2E       | 6           | 3                | All tests in `frontend/tests/login.spec.ts` |
| API       | 0           | 0                | No API tests found for Epic 1               |
| Component | 0           | 0                | No component tests found                    |
| Unit      | 0           | 0                | No unit tests found                         |

---

## Next Steps

### Immediate Actions (Before Release)

1. **Create Docker Setup Tests** (Story 1.1)
   - Test: `tests/e2e/docker-setup.spec.ts`
   - Validate: Container health, architecture compatibility
   - Priority: P0

2. **Create Database Connection Tests** (Story 1.2)
   - Test: `backend/tests/api/test_database_connection.py`
   - Validate: Connection success, error message format
   - Priority: P0

3. **Add JWT Token Validation Tests** (Story 1.3)
   - Test: `backend/tests/api/test_auth_jwt.py`
   - Validate: Token generation, expiry, refresh
   - Priority: P0

### Coverage Improvement Plan

- **Current Coverage:** 33.3% (3/9 criteria)
- **Target Coverage:** 90% for P0 criteria
- **Gap:** 6 criteria need tests
- **Estimated Effort:** 2-3 days for 6 missing tests

---

## Appendix: Test Quality Assessment

### Existing Tests Quality Score: ✅ GOOD

Based on TEA knowledge base (`test-quality.md`):

- ✅ **No Hard Waits:** Tests use `waitForURL()` instead of `waitForTimeout()`
- ✅ **Deterministic:** No conditionals or try-catch for flow control
- ✅ **Explicit Assertions:** All `expect()` calls visible in test bodies
- ✅ **Isolated:** Tests use unique data via `randomPassword()`
- ✅ **Fast:** Tests complete in <30 seconds each

### Recommendations for New Tests

- Follow existing patterns in `frontend/tests/login.spec.ts`
- Use Playwright for E2E, pytest for API tests
- Maintain <300 lines per test file
- Add priority tags: `@p0`, `@p1` for selective execution

---

**Generated by:** BMad Test Architect (testarch-trace workflow)  
**Knowledge Base:** test-priorities-matrix.md, risk-governance.md, test-quality.md  
**Next Workflow:** `/testarch-automate` to generate missing tests
