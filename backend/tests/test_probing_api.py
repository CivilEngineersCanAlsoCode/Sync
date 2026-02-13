
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from app import crud
from app.core.config import settings
from app.models import Job, ProbingQuestion, User

def test_update_probing_question(client: TestClient, db: Session, normal_user_token_headers: dict[str, str]):
    # Get the normal user
    user = crud.get_user_by_email(session=db, email=settings.EMAIL_TEST_USER)
    assert user is not None

    # 1. Create a job
    job = Job(title="Test Job", company="Test Company", url="http://test.com", location="Remote", description="Test Description", owner_id=user.id)
    db.add(job)
    db.commit()
    db.refresh(job)

    # 2. Create a probing question
    question = ProbingQuestion(job_id=job.id, question_text="Test Question?")
    db.add(question)
    db.commit()
    db.refresh(question)

    # 3. Update the answer
    new_answer = "This is my answer."
    response = client.patch(
        f"{settings.API_V1_STR}/probing-questions/{question.id}",
        json={"answer": new_answer},
        headers=normal_user_token_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == new_answer
    assert data["id"] == str(question.id)

    # 4. Verify DB persistence using a NEW session or refresh
    db.refresh(question)
    assert question.answer == new_answer

def test_update_probing_question_not_found(client: TestClient, normal_user_token_headers: dict[str, str]):
    import uuid
    random_id = uuid.uuid4()
    response = client.patch(
        f"{settings.API_V1_STR}/probing-questions/{random_id}",
        json={"answer": "New Answer"},
        headers=normal_user_token_headers
    )
    assert response.status_code == 404

def test_get_job_with_questions(client: TestClient, db: Session, normal_user_token_headers: dict[str, str]):
    # Get the normal user
    user = crud.get_user_by_email(session=db, email=settings.EMAIL_TEST_USER)
    assert user is not None

    # 1. Create a job
    job = Job(title="Test Job 2", company="Test Company 2", url="http://test.com", location="Remote", description="Test Description", owner_id=user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    print(f"DEBUG: Created job with ID: {job.id}")

    # 2. Update status to Ready and add questions
    job.status = "Ready"
    db.add(job)
    db.commit() # Commit job update first
    
    q1 = ProbingQuestion(job_id=job.id, question_text="Q1")
    q2 = ProbingQuestion(job_id=job.id, question_text="Q2")
    db.add(q1)
    db.add(q2)
    db.commit()
    db.refresh(job) # Refresh job to load relationship if eager

    # 3. Fetch job details
    response = client.get(f"{settings.API_V1_STR}/jobs/{job.id}", headers=normal_user_token_headers)
    assert response.status_code == 200
    data = response.json()
    
    assert data["id"] == str(job.id)
    # Check if probing_questions key exists
    assert "probing_questions" in data
    assert len(data["probing_questions"]) == 2
    question_texts = [q["question_text"] for q in data["probing_questions"]]
    assert "Q1" in question_texts
    assert "Q2" in question_texts
