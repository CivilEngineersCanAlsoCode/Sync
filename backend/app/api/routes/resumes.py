import uuid
from typing import Any
import json

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Resume, ResumePublic, ResumesPublic, Message,
    CareerProfile, CareerProfilePublic, CareerProfileExtraction
)
from app.services.ai_factory import AIExtractorDep
import pdfplumber
import io

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/upload", response_model=ResumePublic)
async def upload_resume(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...),
) -> Any:
    """
    Upload a PDF resume and extract text.
    """
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail={"error": "Sirf PDF files allowed hain", "code": "INVALID_FILE_TYPE"}
        )
    
    # Validate file size (10MB limit)
    pdf_bytes = await file.read()
    file_size_mb = len(pdf_bytes) / (1024 * 1024)
    
    if file_size_mb > 10:
        raise HTTPException(
            status_code=400,
            detail={"error": "File bohot badi hai, 10MB se kam honi chahiye", "code": "FILE_TOO_LARGE"}
        )
    
    try:
        # Extract text using pdfplumber
        raw_text = ""
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        raw_text += page_text + "\n"
        except Exception:
            raise HTTPException(
                status_code=400,
                detail={"error": "Invalid PDF file. Please upload a valid PDF.", "code": "INVALID_PDF"}
            )
        
        if not raw_text.strip():
            raise HTTPException(
                status_code=400,
                detail={"error": "Resume parse nahi ho pa raha, text extract nahi hua", "code": "PARSE_ERROR"}
            )
        
        # Save to database
        resume = Resume(
            owner_id=current_user.id,
            filename=file.filename,
            raw_text=raw_text.strip()
        )
        session.add(resume)
        session.commit()
        session.refresh(resume)
        
        print(f"Resume successfully upload aur parse ho gaya: {file.filename}")  # Romanised Hindi log
        return resume
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Resume parse karne mein error aayi: {str(e)}")  # Romanised Hindi log
        raise HTTPException(
            status_code=500,
            detail={"error": "Resume parse nahi ho pa raha", "code": "PARSE_ERROR"}
        )
# Is function se PDF upload aur text extraction hoti hai


@router.get("/", response_model=ResumesPublic)
def read_resumes(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve resumes for current user.
    """
    count_statement = select(Resume).where(Resume.owner_id == current_user.id).offset(skip).limit(limit)
    count = session.exec(count_statement).all()
    
    statement = select(Resume).where(Resume.owner_id == current_user.id).offset(skip).limit(limit)
    resumes = session.exec(statement).all()
    
    return ResumesPublic(data=resumes, count=len(count))


@router.get("/{resume_id}", response_model=ResumePublic)
def read_resume(
    session: SessionDep,
    current_user: CurrentUser,
    resume_id: uuid.UUID,
) -> Any:
    """
    Get resume by ID.
    """
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return resume


@router.delete("/{resume_id}")
def delete_resume(
    session: SessionDep,
    current_user: CurrentUser,
    resume_id: uuid.UUID,
) -> Message:
    """
    Delete a resume.
    """
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    session.delete(resume)
    session.commit()
    return Message(message="Resume deleted successfully")
# Is endpoint se user apna resume delete kar sakta hai


@router.post("/{resume_id}/extract", response_model=CareerProfilePublic)
async def extract_career_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    resume_id: uuid.UUID,
    ai_service: AIExtractorDep,
) -> Any:
    """
    Extract structured career profile from resume using AI.
    Supports both Gemini (cloud) and Ollama (local) providers.
    """
    # Fetch resume
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(
            status_code=404,
            detail={"error": "Resume nahi mila", "code": "NOT_FOUND"}
        )
    
    # Verify ownership
    if resume.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail={"error": "Ye resume aapka nahi hai", "code": "FORBIDDEN"}
        )
    
    # Check if resume has text
    if not resume.raw_text or not resume.raw_text.strip():
        raise HTTPException(
            status_code=400,
            detail={"error": "Resume mein text nahi hai", "code": "EMPTY_RESUME"}
        )
    
    try:
        # Extract using AI with structured schema
        print(f"AI extraction shuru kar rahe hain for resume: {resume.filename}")
        extraction = await ai_service.extract_with_schema(
            resume.raw_text,
            CareerProfileExtraction
        )
        
        #  Convert Pydantic models to JSON strings for database storage
        projects_json = json.dumps([p.model_dump() for p in extraction.projects])
        experience_json = json.dumps([e.model_dump() for e in extraction.experience])
        skills_json = json.dumps([s.model_dump() for s in extraction.skills])
        
        # Save to database
        profile = CareerProfile(
            resume_id=resume.id,
            owner_id=current_user.id,
            projects=projects_json,
            experience=experience_json,
            skills=skills_json,
            ai_provider=ai_service.provider_name
        )
        session.add(profile)
        session.commit()
        session.refresh(profile)
        
        print(f"Career profile successfully extract ho gaya: {resume.filename} (Provider: {ai_service.provider_name})")
        return profile
        
    except ValueError as e:
        # Configuration error (missing API keys, etc.)
        print(f"AI configuration error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={"error": "AI service configured nahi hai", "code": "AI_CONFIG_ERROR"}
        )
    except Exception as e:
        print(f"AI extraction mein error aaya: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={"error": "Resume parse nahi ho pa raha", "code": "PARSE_ERROR"}
        )
# Is endpoint se resume text ko AI se process karke structured career profile create hota hai
