import uuid
from sqlmodel import Session
from fastapi.testclient import TestClient
from app import crud
from app.core.config import settings
from app.models import Job, User
from tests.utils.utils import random_lower_string

def create_random_job(session: Session, owner_id: uuid.UUID) -> Job:
    title = random_lower_string()
    company = random_lower_string()
    jd_text = random_lower_string()
    job = Job(title=title, company=company, jd_text=jd_text, owner_id=owner_id)
    session.add(job)
    session.commit()
    session.refresh(job)
    return job

def test_create_job(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    data = {"title": "Foo", "company": "Bar", "jd_text": "Baz", "url": "http://google.com"}
    response = client.post(
        f"{settings.API_V1_STR}/jobs/", headers=superuser_token_headers, json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["company"] == data["company"]
    assert content["url"] == data["url"]
    assert "id" in content
    assert "owner_id" in content
    assert content["status"] == "Draft"

def test_read_job(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session, superuser: User
) -> None:
    job = create_random_job(db, superuser.id)
    response = client.get(
        f"{settings.API_V1_STR}/jobs/{job.id}", headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == job.title
    assert content["id"] == str(job.id)

def test_read_jobs(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session, superuser: User
) -> None:
    create_random_job(db, superuser.id)
    create_random_job(db, superuser.id)
    response = client.get(
        f"{settings.API_V1_STR}/jobs/", headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2

def test_update_job(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session, superuser: User
) -> None:
    job = create_random_job(db, superuser.id)
    data = {"title": "Updated Title", "status": "APPLIED"}
    response = client.put(
        f"{settings.API_V1_STR}/jobs/{job.id}", headers=superuser_token_headers, json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == "Updated Title"
    assert content["status"] == "APPLIED"

def test_delete_job(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session, superuser: User
) -> None:
    job = create_random_job(db, superuser.id)
    response = client.delete(
        f"{settings.API_V1_STR}/jobs/{job.id}", headers=superuser_token_headers
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Job successfully deleted"}
    # Verify deletion
    response = client.get(
        f"{settings.API_V1_STR}/jobs/{job.id}", headers=superuser_token_headers
    )
    assert response.status_code == 404

from tests.utils.utils import random_lower_string, random_email
from tests.utils.user import authentication_token_from_email

def create_job_with_status(session: Session, owner_id: uuid.UUID, status: str) -> Job:
    title = random_lower_string()
    company = random_lower_string()
    jd_text = random_lower_string()
    job = Job(title=title, company=company, jd_text=jd_text, owner_id=owner_id, status=status)
    session.add(job)
    session.commit()
    session.refresh(job)
    return job

def test_read_job_stats(
    client: TestClient, db: Session
) -> None:
    # Create a fresh user for this test to ensure 0 initial jobs
    email = random_email()
    headers = authentication_token_from_email(client=client, email=email, db=db)
    user = crud.get_user_by_email(session=db, email=email)
    assert user is not None

    # 1. Verify 0 counts for initial state
    response = client.get(
        f"{settings.API_V1_STR}/jobs/stats", headers=headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["Draft"] == 0
    assert content["Applied"] == 0

    # 2. Add jobs with specific statuses for THIS user
    create_job_with_status(db, user.id, "Draft")
    create_job_with_status(db, user.id, "Draft")
    create_job_with_status(db, user.id, "Applied")
    create_job_with_status(db, user.id, "Interviewing")
    create_job_with_status(db, user.id, "Rejected") 

    # 3. Verify counts
    # Explicitly mapping "Rejected" -> "Rejected" in backend. 
    # Frontend will handle the display name change to "Redirected".
    response = client.get(
        f"{settings.API_V1_STR}/jobs/stats", headers=headers
    )
    assert response.status_code == 200
    content = response.json()
    
    assert content["Draft"] == 2
    assert content["Applied"] == 1
    assert content["Interviewing"] == 1
    assert content["Redirected"] == 1
    assert content["Offered"] == 0
