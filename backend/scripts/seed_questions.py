
import sys
import uuid
from sqlmodel import Session, select
from app.core.db import engine
from app.models import Job, ProbingQuestion, User

def seed_questions():
    with Session(engine) as session:
        # Get the most recent job
        statement = select(Job).order_by(Job.created_at.desc()).limit(1)
        job = session.exec(statement).first()

        if not job:
            print("No jobs found. Please create a job first.")
            return

        print(f"Seeding questions for Job: {job.title} ({job.id})")

        # Check if questions already exist
        if job.probing_questions:
             print(f"Job already has {len(job.probing_questions)} questions.")
             # We can add more or just exit. Let's add if less than 2.
             if len(job.probing_questions) >= 2:
                 return

        questions = [
            ProbingQuestion(
                job_id=job.id,
                question_text="What is your experience with asynchronous programming in Python?",
                order=1
            ),
            ProbingQuestion(
                job_id=job.id,
                question_text="Describe a challenging bug you fixed in a React application.",
                order=2
            )
        ]

        for q in questions:
            session.add(q)
        
        session.commit()
        print("Successfully added dummy probing questions.")

if __name__ == "__main__":
    # Ensure app module can be found
    sys.path.append(".") 
    seed_questions()
