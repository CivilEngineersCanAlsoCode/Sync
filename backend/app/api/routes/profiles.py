import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.crud.crud_profile import get_profile_by_resume_id, update_profile
from app.models import CareerProfile, Resume
from app.schemas.profile import CareerProfileRead, CareerProfileUpdate

router = APIRouter()

@router.get("/{id}/profile", response_model=CareerProfileRead)
def read_resume_profile(
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get career profile for a specific resume.
    """
    # Verify resume existence and ownership
    resume = session.get(Resume, id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    profile = get_profile_by_resume_id(session, id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found for this resume")
    
    return profile

@router.patch("/{id}/profile", response_model=CareerProfileRead)
def update_resume_profile(
    id: uuid.UUID,
    profile_in: CareerProfileUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Update career profile (projects, experience, skills).
    """
    # Verify resume existence and ownership
    resume = session.get(Resume, id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    profile = get_profile_by_resume_id(session, id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found for this resume")

    update_profile(session, profile, profile_in)
    return profile
