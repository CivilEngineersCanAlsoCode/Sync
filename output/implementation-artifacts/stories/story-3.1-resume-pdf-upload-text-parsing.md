# Story 3.1: Resume PDF Upload & Text Parsing

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to upload my base resume in PDF format,
so that the system can read my raw career history.

## Acceptance Criteria

1. **Given** main "Profile" page par hun
2. **When** main ek PDF file upload karta hun
3. **Then** backend ko `PyMuPDF` ya similar library se text extract karna chahiye.
4. **And** success hone par logs mein Romanised Hindi comment dikhna chahiye.
5. **And** extracted text database mein save hona chahiye with user reference.

## Tasks / Subtasks

- [ ] **Backend Implementation**
  - [ ] Install PDF parsing library (`PyMuPDF` or `pdfplumber` - see Dev Notes for evaluation)
  - [ ] Create `Resume` SQLModel with fields: `id`, `user_id`, `filename`, `raw_text`, `upload_date`
  - [ ] Create API endpoint `POST /api/v1/resumes/upload` accepting `multipart/form-data`
  - [ ] Implement PDF text extraction logic with error handling
  - [ ] Add Romanised Hindi logging for success/failure states
- [ ] **Frontend Implementation**
  - [ ] Create `/profile` route in `frontend/src/routes/_layout/profile/index.tsx`
  - [ ] Implement file upload component using Shadcn `Input` (type="file")
  - [ ] Add upload progress indicator or loading state
  - [ ] Display success/error toast messages in Romanised Hindi
  - [ ] Show uploaded resume filename and upload date after success
- [ ] **Integration**
  - [ ] Wire frontend to backend API using `React Query` mutation
  - [ ] Ensure proper file validation (PDF only, max size limits)
  - [ ] Handle network errors gracefully

## Dev Notes

### Epic 3 Context

**Goal:** Enable users to upload their base resume, extract career history via AI, and edit the extracted profile manually.

**This Story's Role:** Foundation for AI extraction (Story 3.2). We're creating the raw material (resume text) that AI will parse into structured projects/skills.

**Dependencies:**

- Epic 2 (Jobs Dashboard) is complete - user has job targets saved
- Next Story 3.2 will consume the `raw_text` field created here

### Architecture Compliance

**PDF Library Decision (from Architecture):**
The Architecture doc mentions `PyMuPDF` as the preferred option. However, as noted in Epic 2 Retrospective, we need to evaluate:

1. **PyMuPDF (fitz):** Fast, good for simple layouts. Potential issue with complex multi-column resumes.
2. **pdfplumber:** Better for tabular data and complex layouts. Slightly slower but more robust.
3. **unstructured:** Heavyweight, overkill for simple text extraction.

**Recommendation:** Start with `PyMuPDF` for speed. If testing reveals poor extraction quality on multi-column resumes, switch to `pdfplumber`.

**Installation:**

```bash
pip install PyMuPDF  # or pdfplumber
```

**Database Model:**

```python
from sqlmodel import Field, SQLModel
from datetime import datetime

class Resume(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")  # Link to authenticated user
   filename: str
    raw_text: str  # Extracted PDF text for AI processing
    upload_date: datetime = Field(default_factory=datetime.utcnow)

# Is model se hum user ka uploaded resume aur uska text store karte hain
```

**API Endpoint Pattern:**

```python
from fastapi import UploadFile, File, HTTPException
import fitz  # PyMuPDF

@router.post("/resumes/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail={"error": "Sirf PDF files allowed hain", "code": "INVALID_FILE_TYPE"}
        )

    # Extract text using PyMuPDF
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    raw_text = ""
    for page in doc:
        raw_text += page.get_text()

    # Save to database
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        raw_text=raw_text
    )
    session.add(resume)
    session.commit()

    print("Resume successfully upload aur parse ho gaya")  # Romanised Hindi log
    return {"message": "Resume successfully uploaded!", "resume_id": resume.id}
# Is function se PDF upload aur text extraction hoti hai
```

**Error Handling:**

- Invalid file type: `{"error": "Sirf PDF files allowed hain", "code": "INVALID_FILE_TYPE"}`
- PDF parse failed: `{"error": "Resume parse nahi ho pa raha", "code": "PARSE_ERROR"}`
- File too large: `{"error": "File bohot badi hai, 10MB se kam honi chahiye", "code": "FILE_TOO_LARGE"}`

### UX Patterns

**File Upload Component:**

- Use Shadcn `Input` with `type="file"` and `accept=".pdf"`
- **Drag & Drop:** Consider adding drag-and-drop zone for better UX (optional enhancement)
- ** Progress Indicator:** Show loading spinner while file uploads and parses
- **Empty State:** If no resume uploaded yet, show "Upload your resume to get started" message

**Feedback:**

- Success Toast: "Resume successfully uploaded!" (Romanised Hindi: "Resume upload ho gaya!")
- Error Toast: Display specific error from backend

**Visual Design:**

- **Achromatic Palette:** Keep file upload area clean with whites/grays
- **Icon:** Use upload icon from `lucide-react` (e.g., `Upload` or `FileUp`)

### Testing Standards

**E2E Test (`resume.spec.ts`):**

1. Navigate to `/profile`
2. Upload a sample PDF resume
3. Verify success toast appears
4. Verify uploaded filename is displayed
5. Test error case: Upload non-PDF file, verify error message

**Test Fixtures Needed:**

- `/tests/fixtures/resumes/sample-resume.pdf` (single column, simple format)
- `/tests/fixtures/resumes/complex-resume.pdf` (multi-column or with tables)
- `/tests/fixtures/resumes/invalid.txt` (for error testing)

**Unit Tests (Backend):**

- Test PDF text extraction with sample PDFs
- Test file validation logic
- Test database save operation

### Project Structure Notes

**Backend:**

- `backend/app/models/resume.py`: Resume SQLModel
- `backend/app/api/routes/resumes.py`: Upload endpoint
- `backend/app/utils/pdf_parser.py`: PDF extraction utility (optional separation)

**Frontend:**

- `frontend/src/routes/_layout/profile/index.tsx`: Profile page route
- `frontend/src/components/Profile/ResumeUpload.tsx`: Reusable upload component
- `frontend/src/client/services.gen.ts`: Auto-generated API client (after OpenAPI codegen)

### References

- [Epics: Story 3.1](output/planning-artifacts/epics.md#story-31-resume-pdf-upload--text-parsing)
- [Architecture: Pixel Proxy Decision](output/planning-artifacts/architecture.md#-technical-strategy-pixel-proxy)
- [Epic 2 Retrospective: Test Fixtures Recommendation](output/implementation-artifacts/retrospectives/epic-2-retrospective.md#6-preparation-needed-for-epic-3)

## Dev Agent Record

### Agent Model Used

Antigravity (simulated)

### Completion Notes List

- PDF library evaluation pending (PyMuPDF vs pdfplumber)
- Test fixtures directory needs creation before E2E tests
- OpenAI API setup (for Story 3.2) can happen in parallel with this story
