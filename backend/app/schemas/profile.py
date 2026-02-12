from datetime import datetime
import uuid
from pydantic import BaseModel, Field
from app.models import Project, Experience, SkillCategory, CareerProfileBase

class CareerProfileRead(CareerProfileBase):
    """
    Public response model with structured data (not JSON strings).
    """
    id: uuid.UUID
    resume_id: uuid.UUID
    owner_id: uuid.UUID
    projects: list[Project]
    experience: list[Experience]
    skills: list[SkillCategory]
    extracted_at: datetime

class CareerProfileUpdate(BaseModel):
    """
    Update model for career profile.
    All fields are optional to allow partial updates.
    """
    projects: list[Project] | None = None
    experience: list[Experience] | None = None
    skills: list[SkillCategory] | None = None
