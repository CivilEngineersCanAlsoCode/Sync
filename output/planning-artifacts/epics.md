---
stepsCompleted:
  ["step-01-validate", "step-02-design", "step-03-stories", "step-04-final"]
inputDocuments:
  - output/planning-artifacts/prd.md
  - output/planning-artifacts/architecture.md
  - output/planning-artifacts/ux-design-specification.md
---

# Resume personalisation - Epic Breakdown (Release 2)

## Overview

This document provides the specific Release 2 epics for Resume personalisation, focusing on the "Probing & Generation Trigger" workflow.

## Requirements Inventory (Release 2 Focused)

### Functional Requirements

FR1: User logs in and sees Home dashboard with Job Analytics (Status counts).
FR2: Job Statuses: Draft, Applied, Shortlisted, Interviewing, Waiting for result, Offered, Redirected.
FR3: Add Job Modal: Title, Company, URL, Location, Description (All mandatory). Saves only when valid.
FR4: Job Creation Trigger: Saving job immediately triggers Probing Question generation. (State: Draft -> Ready).
FR5: Job Details (Probing): View generated questions, answer fields initially blank.
FR6: Autosave: Answers autosave immediately when focus changes.
FR7: "Rethink" Action: Button to save all answers, send JSON to n8n webhook (Vector DB update), start creation.
FR8: Resume Workflow State: Job becomes "In-Progress". Resumes page shows disabled record while "In-Progress".
FR9: Resume Completion: State becomes "In-Review". Clicking name shows "Project Relevance" placeholder.

### NonFunctional Requirements

NFR1: Autosave latency < 200ms.
NFR2: Webhook reliability for n8n trigger.

## Epic List

### Epic 1: Auth & Dashboard Foundation

Users can login and view their job pipeline status at a glance.
**FRs covered:** FR1, FR2

### Epic 2: Job Intake & Probing Intelligence

Users can add jobs and answer simulated probing questions (Dummy Data) to build context.
**FRs covered:** FR3, FR4, FR5, FR6

### Epic 3: Generation Workflow & State Management

Users can trigger the simulated resume generation process and track its status (Dummy Data).
**FRs covered:** FR7, FR8, FR9

## Epic 1: Auth & Dashboard Foundation

Users can login and view their job pipeline status at a glance.

### Story 1.1: Login & Access Control

As a User,
I want to log in to the application,
So that my data is secure and accessible only to me.

**Acceptance Criteria:**
**Given** I am on the landing page
**When** I enter valid credentials
**Then** I am redirected to the Home Dashboard

### Story 1.2: Home Dashboard Analytics

As a User,
I want to see a breakdown of my jobs by status,
So that I know where I stand in my job search.

**Acceptance Criteria:**
**Given** I am on the Home Dashboard
**When** the page loads
**Then** I see cards/charts showing counts for: Draft, Applied, Shortlisted, Interviewing, Waiting for result, Offered, Redirected
**And** "Redirected" is used instead of "Rejected"

## Epic 2: Job Intake & Probing Intelligence

Users can add jobs and answer AI-generated probing questions to build context.

### Story 2.1: Add Job Modal & Validation

As a User,
I want to add a new job with all necessary details,
So that the AI has enough information to generate questions.

**Acceptance Criteria:**
**Given** I click "Add Job"
**When** the modal opens
**Then** I see fields: Title, Company, URL, Location, Description
**And** the Save button is disabled until all fields are filled

### Story 2.2: Probing Question Trigger (Draft -> Ready)

As a User,
I want the system to generate questions immediately after saving,
So that I don't have to wait to start the tailoring process.

**Acceptance Criteria:**
**Given** I click Save on the Add Job modal
**When** the job is saved
**Then** the backend triggers the **Simulated** Probing Question generation process (Dummy Data)
**And** the Job status is set to "Draft" initially
**And** updates to "Ready" once questions are generated successfully

### Story 2.3: Probing Interface & Autosave

As a User,
I want to answer probing questions without worrying about saving,
So that my flow is uninterrupted.

**Acceptance Criteria:**
**Given** a job in "Ready" state
**When** I click the Job Name
**Then** I see the list of generated probing questions
**And** answer fields are initially blank

**Given** I am typing an answer
**When** I move to the next field (blur)
**Then** the answer is autosaved to the database

## Epic 3: Generation Workflow & State Management

Users can trigger the simulated resume generation process and track its status (Dummy Data).

### Story 3.1: "Rethink" Action & Webhook Trigger

As a User,
I want to submit my answers to start the resume creation,
So that the AI can use my context to tailor the resume.

**Acceptance Criteria:**
**Given** I have filled out the answers
**When** I click the "Rethink" button (top right)
**Then** the system **simulates** sending the Questions & Answers JSON to the n8n webhook (Log Payload Only)
**And** the Job status changes to "In-Progress"
**And** I am shown a breadcrumb to return to the jobs list

### Story 3.2: Resume State (In-Progress vs In-Review)

As a User,
I want to see the status of my resume generation,
So that I know when it is ready for review.

**Acceptance Criteria:**
**Given** a job is "In-Progress"
**When** I visit the Resumes page
**Then** I see the resume record disabled (non-clickable) with a standardized status indicator

**Given** the generation process completes
**When** I refresh the page
**Then** the status updates to "In-Review" (Simulated Delay)
**And** the resume name becomes clickable

### Story 3.3: Project Relevance View (Placeholder)

As a User,
I want to see the relevant projects for the generated resume,
So that I can verify the content selection.

**Acceptance Criteria:**
**Given** a resume in "In-Review" state
**When** I click the Resume Name
**Then** I am taken to a placeholder screen displaying "Relevant Projects" (Dummy Data)

## Epic 4: AI & Data Integration

Users benefit from real-time AI generation and persistent data synchronization with Vector DBs.

### Story 4.1: Real-time AI Question Generation

As a User,
I want the probing questions to be generated by a real AI model in real-time,
So that they are tailored to the specific Job Description I entered.

**Acceptance Criteria:**
**Given** I save a new job
**When** the background task triggers
**Then** the system calls the configured AI Provider (Gemini/Ollama) instead of using mock data
**And** the generated questions are specific to the Job Description text
**And** the questions are saved to the database

### Story 4.2: Data Pipeline & Vector Sync (n8n)

As a System,
I want to synchronize job and question data with the n8n webhook,
So that the RAG pipeline is kept up-to-date for future retrievals.

**Acceptance Criteria:**
**Given** the user triggers the "Rethink" action or saves answers
**When** the data is committed
**Then** the system sends a payload to the configured n8n webhook URL
**And** handles any network errors gracefully (retries/logging)
