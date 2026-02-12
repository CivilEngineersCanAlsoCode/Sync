# Retrospective: Epic 2 - Job Intelligence & Management

**Date:** 2026-02-12
**Facilitator:** Bob (Scrum Master)
**Participants:** Alice (PO), Charlie (Senior Dev), Dana (QA), Elena (Junior Dev), Satvik (Project Lead)

---

## 1. Epic Summary

**Goal:** Enable users to save and manage job listings, creating the foundation for AI-driven resume tailoring.

**Status:** ✅ **Complete**

- **Stories Delivered:** 3/3 (100%)
- **Quality:** High. All acceptance criteria met. Strong E2E test coverage.

---

## 2. What Went Well (Wins)

Bob (Scrum Master): "Let's start with the good stuff. What went well in Epic 2?"

Alice (Product Owner): "The Jobs Dashboard (Story 2.2) exceeded my expectations. The table looks clean, professional, and the Shadcn UI components gave us that premium feel we were aiming for."

Charlie (Senior Dev): "I'll add - the decision to use `TanStack Table` and `DataTable` component was solid. We got pagination, sorting capabilities, and reusable patterns out of the gate."

Dana (QA Engineer): "From my perspective, the E2E tests were fantastic. The delete flow test (Story 2.3) caught that redirect bug immediately. Without those tests, we would've shipped broken navigation."

Elena (Junior Dev): _smiling_ "The `meta` pattern we implemented for passing handlers to columns was elegant. It felt like we're leveling up architecturally."

Charlie (Senior Dev): "Yeah, and fixing that `AddJobForm` redirect from `/` to `/jobs` - that was a good catch by the tests. Users would've been confused landing on the homepage after creating a job."

### Key Technical Wins

- **Shadcn UI Integration:** `AlertDialog` component added seamlessly for delete confirmation
- **Testing Coverage:** E2E tests validated full user flows (create → list → delete)
- **Architectural Pattern:** `meta` props in `DataTable` for action handlers
- **Error Handling:** Romanised Hindi error messages maintained throughout

---

## 3. Challenges & Lessons Learned

Bob (Scrum Master): "Now let's talk challenges. Where did we struggle?"

Elena (Junior Dev): _hesitates_ "Well, Story 2.3 took longer than expected because the `@radix-ui/react-alert-dialog` wasn't in `package.json`. We had to install it manually after `shadcn` command didn't work."

Charlie (Senior Dev): _slightly defensive_ "Hold on - that's a tooling issue, not a procedural one. The Shadcn CLI should've handled the dependency installation automatically."

Alice (Product Owner): "Fair, but it cost us time. What's the prevention?"

Charlie (Senior Dev): _thinking_ "We could verify dependencies before marking a story as 'ready-for-dev'. Add a checklist: UI components, API methods, test fixtures."

Bob (Scrum Master): "Good systemic fix. Elena, you handled it well by creating the component manually. Nice recovery."

Dana (QA Engineer): "Another issue - the test for delete failed initially due to strict mode finding multiple 'Job to Delete' entries. We had to use `Date.now()` for uniqueness."

Charlie (Senior Dev): "That's a test data management lesson. For E2E, always use dynamic identifiers, never hardcode names."

### Recurring Patterns

- **Dependency Discovery:** Missing packages slowed down Story 2.3 (AlertDialog)
- **Test Data Hygiene:** Strict mode issues required unique job titles in tests
- **Build Errors:** TypeScript linting caught implicit `any` types early (good!)

---

## 4. Previous Epic Follow-Through

Bob (Scrum Master): "Let me check our retrospective from Epic 1..."

_Bob pulls up `epic-1-retrospective.md`_

Bob (Scrum Master): "Interesting... in Epic 1's retro, we committed to maintaining the 'Surgical Documenting' approach and standardizing error codes."

Alice (Product Owner): "How'd we do?"

Bob (Scrum Master): "We completed both! The `DELETE_ERROR` code in Story 2.3 follows the same pattern as `PARSE_ERROR` from Epic 1. And we kept Romanised Hindi comments clean."

Charlie (Senior Dev): _satisfied_ "Consistency pays off. Our error handling is predictable now."

---

## 5. Next Epic Preview: Epic 3 - Resume Intelligence

Bob (Scrum Master): "Let's shift gears. Epic 3 is coming up: 'Resume Upload & Profile Management'"

**Epic 3 includes:**

- Story 3.1: Resume PDF Upload & Text Parsing
- Story 3.2: AI-Driven Project & Skill Extraction
- Story 3.3: Personal Profile Editor (Manual Tweak)

Alice (Product Owner): "From my perspective, we need to make sure the Jobs table (Epic 2) is solid before we start building AI features on top of it."

Charlie (Senior Dev): _concerned_ "I'm worried about **PDF parsing**. We'll need a library like `pdfplumber` or `PyMuPDF` on the backend. That's new infrastructure."

Dana (QA Engineer): "And I need **test fixtures** - sample PDFs with various formats (single column, two column, tables). We can't test AI extraction without realistic data."

Elena (Junior Dev): "I'm less worried about libraries and more about **AI integration**. I don't understand OpenAI's API well enough to work on Story 3.2."

Bob (Scrum Master): "Satvik, the team is surfacing some real concerns here. What's your sense of our readiness?"

---

## 6. Preparation Needed for Epic 3

**Charlie (Senior Dev):** "Here's what I think we need technically before Epic 3 can start..."

### Critical Preparation (Must complete before epic starts):

1. **PDF Library Research** - Evaluate `pdfplumber` vs `PyMuPDF` vs `unstructured` (Est: 4 hours)
   - Owner: Charlie (Senior Dev)
   - Deliverable: Architecture decision doc with pros/cons

2. **OpenAI API Setup** - Create API key, test basic completion endpoint (Est: 2 hours)
   - Owner: Charlie + Elena (pair)
   - Deliverable: Working example in `/backend/tests/test_openai.py`

3. **Test Fixture Creation** - Collect 5-10 sample resumes in various formats (Est: 3 hours)
   - Owner: Dana (QA)
   - Deliverable: `/tests/fixtures/resumes/` folder with anonymized PDFs

**Total critical prep effort:** ~9 hours (1-2 days)

### Parallel Preparation (Can happen during early stories):

1. Design resume storage schema (SQLModel) - can happen during Story 3.1
2. Research prompt engineering patterns - can happen concurrently with Stories 3.1-3.2

Alice (Product Owner): "That's manageable. We can communicate that to stakeholders as 'spike work' for Epic 3."

Bob (Scrum Master): "Satvik, does this preparation plan work for you?"

---

## 7. Action Items

### Team Commitments

- [ ] **Pre-Dev Dependency Checklist** - Before marking stories 'ready-for-dev', verify all UI components and libraries are installed (Owner: Charlie)
- [ ] **Test Data Hygiene Standard** - Use `Date.now()` or UUIDs for dynamic test data in E2E tests (Owner: Dana)
- [ ] **PDF Library Decision** - Complete evaluation and doc by end of week (Owner: Charlie)
- [ ] **AI Learning Session** - Elena pairs with Charlie for OpenAI API tutorial (Owner: Elena + Charlie)
- [ ] **Test Fixtures Repo** - Create anonymized sample resumes for testing (Owner: Dana)

### Retrospective for Epic 3

- Schedule retrospective after all 3 stories are complete
- Focus on AI integration lessons and prompt engineering insights

---

## 8. Metrics & Observations

**Velocity:** Steady. Epic 2 had simpler UI stories compared to Epic 1's infrastructure work.

**Tech Debt:** Minimal. The `DataTable` `meta` pattern adds minor complexity but improves flexibility.

**Team Morale:** High. Stories 2.2 and 2.3 were satisfying to complete - visible UI progress.

---

**Bob (Scrum Master):** "Great retro, team. We shipped a clean Jobs Dashboard, fixed critical bugs via testing, and we're prepared for the AI complexity ahead. Let's carry this momentum into Epic 3!"
