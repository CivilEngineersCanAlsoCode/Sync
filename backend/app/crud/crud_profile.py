import uuid
from sqlmodel import Session, select
from app.models import CareerProfile
from app.schemas.profile import CareerProfileUpdate

def get_profile_by_resume_id(session: Session, resume_id: uuid.UUID) -> CareerProfile | None:
    statement = select(CareerProfile).where(CareerProfile.resume_id == resume_id)
    return session.exec(statement).first()

def update_profile(
    session: Session, db_profile: CareerProfile, profile_in: CareerProfileUpdate
) -> CareerProfile:
    profile_data = profile_in.model_dump(exclude_unset=True)
    
    for key, value in profile_data.items():
        setattr(db_profile, key, value)
    
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)
    return db_profile
