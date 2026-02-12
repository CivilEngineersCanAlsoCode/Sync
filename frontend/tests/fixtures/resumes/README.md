# Test Fixtures - Resume PDFs

This directory contains sample resume PDFs for testing the Resume Upload & Text Parsing feature (Story 3.1).

## Fixture Categories

### 1. `simple-single-column.pdf`

**Description:** Traditional single-column resume with standard sections (Education, Experience, Skills).  
**Use Case:** Baseline test for basic PDF extraction.  
**Expected Behavior:** Clean text extraction with proper section ordering.

---

### 2. `modern-two-column.pdf`

**Description:** Modern multi-column resume with sidebar for skills/contact.  
**Use Case:** Test complex layout handling.  
**Expected Behavior:** Text extracted in logical reading order, not left-to-right jumbled.

---

### 3. `resume-with-table.pdf`

**Description:** Resume with skills listed in a table format.  
**Use Case:** Test table detection and extraction.  
**Expected Behavior:** Skills table should be extracted as structured data or readable text.

---

### 4. `complex-formatting.pdf`

**Description:** Resume with unusual fonts, colors, and graphics.  
**Use Case:** Stress test for extraction robustness.  
**Expected Behavior:** Text extracted despite visual complexity.

---

### 5. `invalid-file.txt`

**Description:** Non-PDF file (plain text).  
**Use Case:** Test file type validation.  
**Expected Error:** `{"error": "Sirf PDF files allowed hain", "code": "INVALID_FILE_TYPE"}`

---

### 6. `corrupted.pdf`

**Description:** Corrupted or malformed PDF file.  
**Use Case:** Test error handling for parse failures.  
**Expected Error:** `{"error": "Resume parse nahi ho pa raha", "code": "PARSE_ERROR"}`

---

## Creating Fixtures

**IMPORTANT:** For privacy, all test fixtures should use **anonymized** or **fictional** resume data.

### Option 1: Generate Synthetic Resumes

Use online tools like:

- Canva Resume Templates (export as PDF)
- LaTeX resume templates (compile to PDF)
- Word/Google Docs templates (export as PDF)

### Option 2: Request User-Provided Samples

Ask Satvik to provide anonymized versions of real resumes (names/contact info redacted).

---

## Next Steps

- [ ] Create or source 4-6 sample resume PDFs
- [ ] Add PDFs to this directory
- [ ] Document actual vs expected text extraction in test cases
- [ ] Update E2E tests (`resume.spec.ts`) to reference these fixtures

**Status:** 🟡 Directory created, fixtures pending
**Owner:** Dana (QA)
