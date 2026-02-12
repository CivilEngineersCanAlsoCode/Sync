import uuid
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import Resume, CareerProfile, User
from app.tests.utils.utils import random_lower_string

def test_get_profile(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    # 1. Create a Resume
    user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
    resume = Resume(
        owner_id=user.id,
        filename="test.pdf",
        raw_text="Test Content"
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # 2. Create a Profile
    profile = CareerProfile(
        resume_id=resume.id,
        owner_id=user.id,
        projects='[{"title": "P1", "description": "D1", "technologies": ["T1"]}]',
        experience='[]',
        skills='[{"category": "C1", "skills": ["S1"]}]',
        ai_provider="test"
    )
    db.add(profile)
    db.commit()

    # 3. Get Profile
    r = client.get(
        f"{settings.API_V1_STR}/resumes/{resume.id}/profile",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    data = r.json()
    assert data["resume_id"] == str(resume.id)
    assert len(data["projects"]) == 1
    assert data["projects"][0]["title"] == "P1"
    assert data["skills"][0]["category"] == "C1"

def test_update_profile(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    # 1. Create a Resume & Profile
    user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
    resume = Resume(
        owner_id=user.id,
        filename="test_update.pdf",
        raw_text="Test Content"
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    profile = CareerProfile(
        resume_id=resume.id,
        owner_id=user.id,
        projects='[]',
        experience='[]',
        skills='[]',
        ai_provider="test"
    )
    db.add(profile)
    db.commit()

    # 2. Update Profile
    update_data = {
        "projects": [{"title": "New Project", "description": "Desc", "technologies": ["Python"]}],
        "skills": [{"category": "Backend", "skills": ["FastAPI"]}]
    }
    
    r = client.patch(
        f"{settings.API_V1_STR}/resumes/{resume.id}/profile",
        headers=superuser_token_headers,
        json=update_data,
    )
    assert r.status_code == 200
    data = r.json()
    assert len(data["projects"]) == 1
    assert data["projects"][0]["title"] == "New Project"
    assert len(data["skills"]) == 1
    assert data["skills"][0]["skills"][0] == "FastAPI"

    # 3. Verify Persistence
    db.refresh(profile)
    # Note: DB might store as string or object depending on driver, but API should return object
    r2 = client.get(
        f"{settings.API_V1_STR}/resumes/{resume.id}/profile",
        headers=superuser_token_headers,
    )
    assert r2.status_code == 200
    data2 = r2.json()
    assert data2["projects"][0]["title"] == "New Project"
