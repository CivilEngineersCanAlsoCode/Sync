# PDF Library Evaluation: PyMuPDF vs pdfplumber

## Objective

Choose the best PDF parsing library for extracting text from resume PDFs for AI processing.

## Comparison

### PyMuPDF (fitz)

**Pros:**

- ⚡ **Fast**: 3-5x faster than pdfplumber for simple text extraction
- 📦 **Lightweight**: Smaller memory footprint (~15MB installed)
- 🎯 **Good for simple layouts**: Single-column resumes with standard formatting
- 📚 **Mature**: Widely used, well-documented
- 🔧 **Easy installation**: `pip install PyMuPDF`

**Cons:**

- ❌ **Struggles with complex layouts**: Multi-column, tables, and unusual formatting
- ❌ **Text order issues**: May extract text in wrong order for 2-column resumes
- ❌ **No table detection**: Cannot identify tabular data structures

**Best for:** Traditional single-column resumes, speed-critical applications

---

### pdfplumber

**Pros:**

- ✅ **Excellent layout preservation**: Maintains spatial relationships
- 📊 **Table extraction**: Built-in table detection (crucial for skills/projects tables)
- 🎨 **Multi-column support**: Handles complex resume layouts correctly
- 🔍 **Character-level precision**: Access to exact positions and bounding boxes
- 🧪 **Better for AI**: Structured output helps AI understand resume sections

**Cons:**

- 🐌 **Slower**: 3-5x slower than PyMuPDF
- 💾 **Heavier**: Larger memory footprint (~25MB installed)
- 🔧 **More complex API**: Requires more code for basic extraction

**Best for:** Complex multi-column resumes, resumes with tables, AI-driven parsing

---

## Decision

### ✅ **Recommendation: pdfplumber**

**Rationale:**

1. **Resume complexity**: Modern resumes often use multi-column layouts, tables for skills, and complex formatting. pdfplumber handles these reliably.
2. **AI integration**: Story 3.2 will use AI to extract structured data (projects, skills). pdfplumber's layout preservation gives better context to the AI model.
3. **Quality over speed**: A 2-second parse time vs 0.5 seconds is negligible for a one-time upload operation. Data quality is more important.
4. **Table support**: Many resumes list skills/technologies in tables. pdfplumber can extract these properly.

### Implementation Plan

```python
# Install
pip install pdfplumber

# Usage
import pdfplumber

with pdfplumber.open(pdf_path) as pdf:
    full_text = ""
    for page in pdf.pages:
        full_text += page.extract_text()

        # Optional: Extract tables separately
        tables = page.extract_tables()
        for table in tables:
            # Process table data if needed
            pass
```

### Fallback Strategy

If pdfplumber proves too slow in production (>5 seconds for typical resume):

1. Try PyMuPDF first for speed
2. Fall back to pdfplumber if extraction quality is poor
3. Add user option to choose library in settings

---

## Testing Plan

Create test fixtures covering:

- ✅ Single-column traditional resume
- ✅ Multi-column modern resume
- ✅ Resume with skills table
- ✅ Resume with unusual formatting
- ❌ Invalid PDF (for error handling)
- ❌ Corrupted PDF (for robustness)

---

**Decision Date:** 2026-02-12  
**Owner:** Charlie (Senior Dev)  
**Status:** ✅ Complete
