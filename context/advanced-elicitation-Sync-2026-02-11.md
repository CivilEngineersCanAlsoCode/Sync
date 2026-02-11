---
workflowType: advanced-elicitation
source_doc: planning-artifacts/prd.md
methods_applied:
  [
    "Challenge from Critical Perspective",
    "Failure Mode Analysis",
    "Architecture Decision Records",
    "Customer Support Theater",
    "Red Team vs Blue Team",
  ]
date: 2026-02-11
---

# Advanced Elicitation Report: Sync Architecture (n8n + Vector DB)

## 1. Challenge from Critical Perspective (Risk)

**Assumption:** "Vector DB complexity is low because it's abstracted inside n8n workflow."

**Critique (The Devil's Advocate):**
"You assume n8n simplifies vector logic, but does it?

1.  **Debugging Hell:** When a vector embedding fails (e.g., Gemini API returns a 500 or malformed JSON), debugging a visual workflow with retry loops is often _harder_ than reading a Python stack trace.
2.  **Version Control:** How do you version control your 'abstraction'? If you tweak the n8n JSON, how do you rollback if it breaks production?
3.  **Latency:** A webhook roundtrip -> n8n -> OpenAI -> Pinecone -> n8n -> Webhook response adds significant latency compared to a direct backend call. Are you okay with the user staring at a spinner for 10 seconds?

**Mitigiation Strategy Required:**

- Visual 'Try Catch' nodes in n8n.
- Git integration for n8n workflows (using the JSON export).
- Async 'Prediction' UI (updates later via WebSocket/Polling) rather than blocking HTTP response.

---

## 2. Failure Mode Analysis (Risk)

**Scenario:** User uploads a Resume PDF.
**Goal:** Ingest into Pinecone via n8n.

**Failure Modes:**

1.  **Docker Crash:** The local n8n container runs out of RAM (PDF parsing is heavy).
    - _Result:_ Webhook times out. User gets "Sync Failed".
    - _Fix:_ Resource limits on Docker; Queue system (Redis/RabbitMQ) _before_ n8n if possible, or reliance on n8n's internal execution queue (if configured).
2.  **Pinecone Rate Limit:** You hit the "Starter" plan write limit.
    - _Result:_ n8n workflow errors out.
    - _Fix:_ Implement "Split in Batches" node in n8n with delays.
3.  **Webhook Timeout:** Next.js waits for n8n, but n8n is processing a large PDF. Connection drops after 30s.
    - _Fix:_ **Fire and Forget**. Next.js sends webhook -> n8n replies "202 Accepted" immediately -> n8n processes in background -> n8n calls a _separate_ webhook on Next.js to update status "Done".

---

## 3. Architecture Decision Record (ADR-001)

**Title:** Abstraction of Vector Logic via Self-Hosted n8n

**Context:** We need a way to ingest and retrieve resume vectors.
**Options:**
A. **Python Backend (Django/FastAPI):** Standard, code-based, full control.
B. **Next.js API Routes:** Serverless edge functions (might timeout).
C. **n8n (Self-Hosted Docker):** Low-code, visual, easy integrations.

**Decision:** Option C (n8n).

**Justification:**

- **Velocity:** Faster to drag-and-drop an "Embed -> Upsert" flow than write boilerplate.
- **Maintenance:** Easier to visualize the data flow.
- **Cost:** Self-hosted on existing hardware (Free).

**Consequences:**

- **Complexity Shift:** DevOps complexity increases (managing Docker container, backups, updates) vs Code complexity.
- **Security Risk:** Exposing a local container to the internet (Tunneling/ngrok?) for webhooks requires a robust security layer.

---

## 4. Customer Support Theater (Collaboration)

**User (Angry):** "I synced my resume an hour ago and the 'Tailor' button still says 'No Experience Found'! I need to apply now!"

**Support (You):** "Let me check the logs... okay, I see the webhook hit n8n..."

**The Gap:**

- Without centralized logging (e.g., Sentry connected to n8n), you have to SSH into the server and grep Docker logs.
- **Requirements:**
  1.  n8n **Error Trigger** workflow that sends an alert (Email/Slack/Discord) when a workflow fails.
  2.  User-facing "Sync Status" dashboard in the app (Polling an API endpoint that checks n8n status).

---

## 5. Red Team vs Blue Team (Security)

**Red Team (Attacker):**

- **Attack Vector:** The public webhook URL for n8n.
- **Action:** I flood the webhook with 10,000 requests/second.
- **Result:** Your local Docker container crashes. Your laptop CPU spikes to 100%. Resume builder goes offline.
- **Action 2:** I send a malformed JSON payload `{ "resume_text": <1GB string> }`.
- **Result:** n8n tries to parse it and OOMs (Out of Memory).

**Blue Team (Defense):**

- **Defense 1:** **Shared Secret Token** in headers (reject requests immediately without parsing if token missing).
- **Defense 2:** **Rate Limiting** at the Next.js layer (middleware) BEFORE calling the n8n webhook. (Don't expose n8n directly to public internet; proxy it through Next.js backend).
- **Defense 3:** Payload size limit in Next.js Body Parser (e.g., 2MB).

---

## Conclusion & Prd Updates

- **Complexity:** Remains **Medium**. The _code_ is simpler, but the _system architecture_ (DevOps, Security, Async flows) is non-trivial.
- **Architecture:** Confirmed "Fire-and-Forget" pattern for reliable PDF processing.
- **Security:** Must proxy n8n via Next.js backend, never expose directly.
