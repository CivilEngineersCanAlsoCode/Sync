import asyncio
import logging
import uuid
from sqlmodel import Session

from app.core.db import engine
from app.core.constants import FALLBACK_PROBING_QUESTIONS
from app.models import Job, ProbingQuestion, ProbingQuestionsExtraction
from app.services.ai_factory import get_ai_provider

logger = logging.getLogger(__name__)


def generate_probing_questions(job_id: uuid.UUID) -> None:
    """
    Generates probing questions for a job using the configured AI provider.
    Runs in a thread pool via BackgroundTasks to avoid blocking the event loop.
    Updates job status to 'Ready' upon success.
    """
    with Session(engine) as session:
        # Zombie Job Prevention (AC: 10)
        job = session.get(Job, job_id)
        if not job:
            logger.warning(f"TECH_CODE: ZOMBIE_JOB - Job {job_id} delete ho chuki hai background task chalne se pehle")
            return
        # Background task trigger hone ke baad check karte hain ki job exist karti hai ya nahi

        try:
            # Extreme Context Length Handling (AC: 7)
            description = (job.description[:5000] + "...") if job.description and len(job.description) > 5000 else (job.description or "")
            context = f"Title: {job.title}\nCompany: {job.company}\nDescription: {description}"
            # 5000 chars se zyada JD ko truncate karte hain taaki AI window overflow na ho
            
            # Missing AI Provider Handling (AC: 5)
            try:
                provider = get_ai_provider()
            except Exception as e:
                logger.error(f"TECH_CODE: AI_UNAVAILABLE - AI Provider nahi mila: {str(e)}")
                return # Keep status as Draft for manual retry
            # Provider initialize karte waqt check karte hain ki configuration sahi hai

            logger.info(f"Generating questions for job {job_id} using {provider.provider_name}...")
            
            # Malformed/Schema Error Handling (AC: 6 & 8)
            try:
                # Use asyncio.run since provider method is async but this wrapper is now sync for thread safety
                extraction = asyncio.run(provider.extract_with_schema(
                    text=context,
                    schema=ProbingQuestionsExtraction
                ))
            except Exception as e:
                logger.warning(f"TECH_CODE: AI_SCHEMA_ERROR - AI ne expected format nahi diya ya description vague hai: {str(e)}")
                
                # Incomplete Job Description Fallback (AC: 6)
                logger.info("Fallback: Generic probes generate kar rahe hain")
                extraction = ProbingQuestionsExtraction(questions=FALLBACK_PROBING_QUESTIONS)
            # Agar AI fail hota hai ya JD gap hai, toh user flow break na ho isliye generic probes dete hain
            
            # Save generated questions (AC: 3)
            for q_data in extraction.questions:
                # Handle both dict and object (as extraction can be from direct Pydantic model)
                q_text = q_data.get("question") if isinstance(q_data, dict) else q_data.question
                question = ProbingQuestion(
                    job_id=job.id,
                    question_text=q_text
                )
                session.add(question)
            
            # Final State Transition (AC: 4)
            job.status = "Ready"
            session.add(job)
            session.commit()
            logger.info(f"Successfully generated questions and updated job {job_id} to Ready")
            
        except Exception as e:
            # DB Transaction Rollback (AC: 9)
            logger.error(f"Error generating probing questions for job {job_id}: {str(e)}")
            session.rollback()
    # Is synchronous wrapper se hum background tasks mein thread-safe DB transactions aur AI calls handle karte hain
