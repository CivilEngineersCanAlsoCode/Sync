import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import Job, JobCreate, JobPublic, JobsPublic, JobUpdate, Message

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/", response_model=JobsPublic)
def read_jobs(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve jobs.
    """
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Job)
        count = session.exec(count_statement).one()
        statement = select(Job).offset(skip).limit(limit)
        jobs = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Job)
            .where(Job.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Job)
            .where(Job.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        jobs = session.exec(statement).all()

    return JobsPublic(data=jobs, count=count)
# Ye endpoint current user ke saved jobs return karta hai.


@router.get("/{id}", response_model=JobPublic)
def read_job(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get job by ID.
    """
    job = session.get(Job, id)
    if not job:
        raise HTTPException(
            status_code=404,
            detail={"error": "Job nahi mili", "code": "JOB_NOT_FOUND"},
        )
    if not current_user.is_superuser and (job.owner_id != current_user.id):
        raise HTTPException(
            status_code=400,
            detail={"error": "Aapke paas permission nahi hai", "code": "PERM_DENIED"},
        )
    return job
# Ye endpoint specific job ID ki details fetch karta hai.


@router.post("/", response_model=JobPublic)
def create_job(
    *, session: SessionDep, current_user: CurrentUser, job_in: JobCreate
) -> Any:
    """
    Create new job.
    """
    job = crud.create_job(session=session, job_in=job_in, owner_id=current_user.id)
    return job
# Ye endpoint nayi job create karta hai aur user ko owner assign karta hai.


@router.put("/{id}", response_model=JobPublic)
def update_job(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    job_in: JobUpdate,
) -> Any:
    """
    Update a job.
    """
    job = session.get(Job, id)
    if not job:
        raise HTTPException(
            status_code=404,
            detail={"error": "Job nahi mili", "code": "JOB_NOT_FOUND"},
        )
    if not current_user.is_superuser and (job.owner_id != current_user.id):
        raise HTTPException(
            status_code=400,
            detail={"error": "Aapke paas permission nahi hai", "code": "PERM_DENIED"},
        )
    update_dict = job_in.model_dump(exclude_unset=True)
    job.sqlmodel_update(update_dict)
    session.add(job)
    session.commit()
    session.refresh(job)
    return job
# Ye endpoint existing job ko update karta hai.


@router.delete("/{id}")
def delete_job(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a job.
    """
    job = session.get(Job, id)
    if not job:
        raise HTTPException(
            status_code=404,
            detail={"error": "Job nahi mili", "code": "JOB_NOT_FOUND"},
        )
    if not current_user.is_superuser and (job.owner_id != current_user.id):
        raise HTTPException(
            status_code=400,
            detail={"error": "Aapke paas permission nahi hai", "code": "PERM_DENIED"},
        )
    session.delete(job)
    session.commit()
    return Message(message="Job successfully deleted")
# Ye endpoint job ko delete karta hai.
