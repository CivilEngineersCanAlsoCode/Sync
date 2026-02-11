# Story 1.2: Database Connection & Basic SQLModel Setup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a system,
I want to establish a reliable connection to PostgreSQL using SQLModel,
so that career data (JDs and Resumes) can be stored persistently.

## Acceptance Criteria

1. [x] **Postgres Healthcheck:** Postgres container healthy state mein hai aur backend uske baad hi start hota hai.
2. [x] **Database Connected Log:** Backend main entry point launch hone par "Database Connected" ka message logs mein dikhta hai.
3. [x] **Error Format:** Connection fail hone par error message format `{ "error": "Database se connect nahi ho pa rahe hain, please settings check karein", "code": "DB_CONN_ERROR" }` hona chahiye.

## Tasks / Subtasks

- [x] PostgreSQL Engine Setup (AC: 1, 2)
  - [x] `backend/app/core/db.py` mein SQLModel engine create kiya with `create_engine(str(settings.SQLALCHEMY_DATABASE_URI))`.
  - [x] `verify_db_connection()` function implemented — `select(1)` query se connection test karta hai.
  - [x] Successful connection par "Database Connected" log message.
- [x] Application Startup Integration (AC: 2)
  - [x] `backend/app/main.py` mein `@asynccontextmanager` lifespan hook se `verify_db_connection()` call hota hai.
  - [x] `backend/app/backend_pre_start.py` mein retry logic ke saath `init(engine)` call.
- [x] Error Handling (AC: 3)
  - [x] Connection failure par Romanised Hindi error message with `DB_CONN_ERROR` code logged aur raised.
- [x] Docker Healthcheck (AC: 1)
  - [x] `compose.yml` mein PostgreSQL 18 ka healthcheck configured (`pg_isready`, interval 10s, retries 5).
  - [x] Backend service `depends_on: db: condition: service_healthy` set hai.
- [x] Dependencies (AC: 1)
  - [x] `pyproject.toml` mein `sqlmodel>=0.0.21` aur `psycopg[binary]>=3.1.13` listed hain.

## Dev Notes

- **Architecture Compliance:** Follow [architecture.md](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/architecture.md).
- **SQLModel Pattern:** Engine aur session management `backend/app/core/db.py` mein centralized hai.
- **Pre-start Script:** `backend_pre_start.py` ensure karta hai ki database ready hai before app accepts requests.
- **Romanised Hindi:** Error messages aur startup logs sab Romanised Hindi mein hain.

### Key Files

- `backend/app/core/db.py` — Database engine, session, aur `verify_db_connection()`
- `backend/app/core/config.py` — `SQLALCHEMY_DATABASE_URI` settings
- `backend/app/main.py` — Lifespan hook with DB verification
- `backend/app/backend_pre_start.py` — Pre-start DB readiness check
- `backend/app/models.py` — SQLModel models (User, Item)
- `compose.yml` — PostgreSQL service with healthcheck
- `backend/pyproject.toml` — SQLModel & psycopg dependencies

### References

- [Architecture: Database Layer](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/planning-artifacts/architecture.md)
- [Project Context: Error Format](file:///Users/satvikjain/Downloads/Resume%20personalisation/output/project-context.md)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (BMad Master verification)

### Debug Log References

### Completion Notes List

- Story verified via code inspection — all acceptance criteria met.
- PostgreSQL healthcheck, SQLModel integration, error handling, aur startup logging sab implemented hain.

### File List

- backend/app/core/db.py
- backend/app/core/config.py
- backend/app/main.py
- backend/app/backend_pre_start.py
- backend/app/models.py
- compose.yml
- backend/pyproject.toml
