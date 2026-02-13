import uuid
from datetime import datetime, timezone

from pydantic import EmailStr, BaseModel, Field
from sqlalchemy import DateTime, Column, JSON
from sqlmodel import Field, Relationship, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    jobs: list["Job"] = Relationship(back_populates="owner", cascade_delete=True)
    resumes: list["Resume"] = Relationship(back_populates="owner", cascade_delete=True)
    career_profiles: list["CareerProfile"] = Relationship(back_populates="owner", cascade_delete=True)


class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


# Item Models
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Job Models
class JobBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    company: str = Field(min_length=1, max_length=255)
    url: str | None = Field(default=None, max_length=512)
    jd_text: str


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore
    company: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore
    url: str | None = Field(default=None, max_length=512)
    jd_text: str | None = None  # type: ignore
    status: str | None = Field(default=None, max_length=50)


class Job(JobBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    status: str = Field(default="Draft", max_length=50)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="jobs")
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),
    )
# Is model se hum job listings ko user-specific database mein store karte hain


class JobPublic(JobBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    status: str
    created_at: datetime | None


class JobsPublic(SQLModel):
    data: list[JobPublic]
    count: int


# Resume Models
class ResumeBase(SQLModel):
    filename: str = Field(max_length=255)
    raw_text: str  # Extracted PDF text for AI processing in Story 3.2

class Resume(ResumeBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="resumes")
    upload_date: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),
    )
# Is model se hum user ka uploaded resume aur uska text store karte hain

class ResumeCreate(SQLModel):
    pass  # File upload, no body needed

class ResumePublic(ResumeBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    upload_date: datetime | None

class ResumesPublic(SQLModel):
    data: list[ResumePublic]
    count: int


# AI Extraction Pydantic Models (for structured JSON output)
class Project(BaseModel):
    """Individual project extracted from resume"""
    title: str = Field(description="Project name or title")
    description: str = Field(description="Brief description of what was built")
    technologies: list[str] = Field(description="Technologies, languages, frameworks used")
    impact: str | None = Field(default=None, description="Business impact or metrics if mentioned")
# Ye model ek project ki details store karta hai AI extraction ke liye


class Experience(BaseModel):
    """Work experience entry from resume"""
    company: str = Field(description="Company name")
    role: str = Field(description="Job title/role")
    duration: str = Field(description="Time period, e.g., '2020-2023' or '2 years'")
    responsibilities: list[str] = Field(description="Key responsibilities and achievements")
# Ye model work experience ki details store karta hai


class SkillCategory(BaseModel):
    """Categorized skills from resume"""
    category: str = Field(description="Skill category, e.g., 'Backend', 'Frontend', 'DevOps'")
    skills: list[str] = Field(description="List of skills in this category")
# Ye model skills ko categories mein organize karta hai


class CareerProfileExtraction(BaseModel):
    """
    Complete structured extraction schema for AI providers.
    This will be passed to Gemini/Ollama to enforce JSON structure.
    """
    projects: list[Project] = Field(description="List of projects from resume", default_factory=list)
    experience: list[Experience] = Field(description="Work experience history", default_factory=list)
    skills: list[SkillCategory] = Field(description="Categorized skills", default_factory=list)
# Ye Pydantic model AI ko batata hai ki response mein exact kya-kya fields hone chahiye


# Career Profile Database Models
class CareerProfileBase(SQLModel):
    """Base model for career profile - AI extracted data"""
    ai_provider: str = Field(max_length=50, description="AI provider used: 'gemini' or 'ollama'")


class CareerProfile(CareerProfileBase, table=True):
    """Database model to store AI-extracted career profile"""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    resume_id: uuid.UUID = Field(foreign_key="resume.id", nullable=False, ondelete="CASCADE")
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    
    # JSON columns for structured data
    projects: str = Field(sa_column=Column(JSON))  # Serialized list[Project]
    experience: str = Field(sa_column=Column(JSON))  # Serialized list[Experience]
    skills: str = Field(sa_column=Column(JSON))  # Serialized list[SkillCategory]
    
    extracted_at: datetime = Field(default_factory=get_datetime_utc, sa_type=DateTime(timezone=True))
    
    # Relationships
    owner: User | None = Relationship(back_populates="career_profiles")
# Is model se hum AI-extracted career profile data ko database mein permanently store karte hain


class CareerProfilePublic(CareerProfileBase):
    """Public response model for career profile"""
    id: uuid.UUID
    resume_id: uuid.UUID
    owner_id: uuid.UUID
    projects: str  # JSON string
    experience: str  # JSON string
    skills: str  # JSON string
    extracted_at: datetime


class CareerProfilesPublic(SQLModel):
    """List of career profiles"""
    data: list[CareerProfilePublic]
    count: int
