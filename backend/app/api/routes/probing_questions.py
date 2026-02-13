
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.deps import CurrentUser, SessionDep
from app.models import ProbingQuestion, ProbingQuestionPublic, ProbingQuestionUpdate, Message

router = APIRouter()

@router.patch("/{id}", response_model=ProbingQuestionPublic)
def update_probing_question(
    id: uuid.UUID,
    question_in: ProbingQuestionUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Update a probing question's answer.
    """
    question = session.get(ProbingQuestion, id)
    if not question:
        raise HTTPException(status_code=404, detail="Probing question not found")
    
    # Ensure user owns the job related to this question
    if question.job.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Update fields
    if question_in.answer is not None:
        question.answer = question_in.answer
    
    session.add(question)
    session.commit()
    session.refresh(question)
    return question
# Is endpoint se hum probing question ka answer update karte hain using PATCH request.
