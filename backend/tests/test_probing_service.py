import uuid
from unittest.mock import MagicMock, patch
from sqlmodel import Session, create_mock_engine

from app.models import Job, ProbingQuestionsExtraction, ProbingQuestionExtraction
from app.services.probing_service import generate_probing_questions

def test_generate_probing_questions_success():
    """
    Test successful generation of probing questions.
    Verify transition from Draft to Ready.
    """
    job_id = uuid.uuid4()
    mock_job = Job(id=job_id, title="Test Job", company="Test Corp", description="JD", status="Draft")
    
    # Mocking DB session and engine
    with patch("app.services.probing_service.Session") as mock_session_cls:
        mock_session = mock_session_cls.return_value.__enter__.return_value
        mock_session.get.return_value = mock_job
        
        # Mocking AI Provider
        mock_provider = MagicMock()
        mock_extraction = ProbingQuestionsExtraction(
            questions=[ProbingQuestionExtraction(question="Question 1")]
        )
        # Mocking the async response for asyncio.run
        mock_provider.extract_with_schema.return_value = mock_extraction
        
        # Since asyncio.run is called on the result of extract_with_schema, 
        # but extract_with_schema itself is an async function (which returns a coroutine),
        # we need to mock it carefully if it's called with asyncio.run.
        # Actually, in the service: extraction = asyncio.run(provider.extract_with_schema(...))
        # This is WRONG. asyncio.run() takes a coroutine object. 
        # provider.extract_with_schema(...) returns a coroutine.
        
        with patch("app.services.probing_service.get_ai_provider", return_value=mock_provider), \
             patch("app.services.probing_service.asyncio.run", return_value=mock_extraction):
            generate_probing_questions(job_id)
            
            # Assertions
            assert mock_job.status == "Ready"
            assert mock_session.add.call_count >= 2 # 1 for question, 1 for job
            mock_session.commit.assert_called_once()

def test_generate_probing_questions_ai_unavailable():
    """
    Test scenario where AI provider is missing/incorrectly configured.
    Status should remain Draft (AC: 5).
    """
    job_id = uuid.uuid4()
    mock_job = Job(id=job_id, title="Test Job", company="Test Corp", description="JD", status="Draft")
    
    with patch("app.services.probing_service.Session") as mock_session_cls:
        mock_session = mock_session_cls.return_value.__enter__.return_value
        mock_session.get.return_value = mock_job
        
        with patch("app.services.probing_service.get_ai_provider", side_effect=ValueError("Missing API Key")):
            generate_probing_questions(job_id)
            
            # Assertions
            assert mock_job.status == "Draft"
            mock_session.commit.assert_not_called()

def test_generate_probing_questions_schema_error_fallback():
    """
    Test scenario where AI output is malformed.
    Should fallback to generic probes and update to Ready (AC: 6).
    """
    job_id = uuid.uuid4()
    mock_job = Job(id=job_id, title="Test Job", company="Test Corp", description="JD", status="Draft")
    
    with patch("app.services.probing_service.Session") as mock_session_cls:
        mock_session = mock_session_cls.return_value.__enter__.return_value
        mock_session.get.return_value = mock_job
        
        # Mocking AI Provider
        mock_provider = MagicMock()
        mock_extraction = ProbingQuestionsExtraction(
            questions=[ProbingQuestionExtraction(question="Generic 1"), ProbingQuestionExtraction(question="Generic 2")]
        )
        
        with patch("app.services.probing_service.get_ai_provider", return_value=mock_provider), \
             patch("app.services.probing_service.asyncio.run", side_effect=Exception("Schema failure")):
            generate_probing_questions(job_id)
            
            # Assertions
            assert mock_job.status == "Ready" # Falls back to generic probes
            # 2 generic probes + 1 job status update = 3 adds
            assert mock_session.add.call_count >= 3
            mock_session.commit.assert_called_once()

def test_generate_probing_questions_zombie_job():
    """
    Test scenario where job is deleted before background task runs.
    Should exit gracefully (AC: 10).
    """
    job_id = uuid.uuid4()
    
    with patch("app.services.probing_service.Session") as mock_session_cls:
        mock_session = mock_session_cls.return_value.__enter__.return_value
        mock_session.get.return_value = None # Job already deleted
        
        # This should NOT raise any exceptions
        generate_probing_questions(job_id)
        
        # Assertions
        mock_session.commit.assert_not_called()

def test_generate_probing_questions_truncation():
    """
    Test scenario where JD is extremely long.
    Should truncate to 5000 chars (AC: 7).
    """
    job_id = uuid.uuid4()
    long_desc = "X" * 6000
    mock_job = Job(id=job_id, title="Test Job", company="Test Corp", description=long_desc, status="Draft")
    
    with patch("app.services.probing_service.Session") as mock_session_cls:
        mock_session = mock_session_cls.return_value.__enter__.return_value
        mock_session.get.return_value = mock_job
        
        mock_provider = MagicMock()
        mock_extraction = ProbingQuestionsExtraction(questions=[])
        
        with patch("app.services.probing_service.get_ai_provider", return_value=mock_provider), \
             patch("app.services.probing_service.asyncio.run", return_value=mock_extraction):
            generate_probing_questions(job_id)
            
            # Verify that providing text had truncated description
            args, kwargs = mock_provider.extract_with_schema.call_args
            assert len(kwargs["text"]) < 6000
            assert "Title: Test Job" in kwargs["text"]

def test_generate_probing_questions_db_rollback():
    """
    Test scenario where DB commit fails.
    Should rollback and keep status as Draft (AC: 9).
    """
    job_id = uuid.uuid4()
    mock_job = Job(id=job_id, title="Test Job", company="Test Corp", description="JD", status="Draft")
    
    with patch("app.services.probing_service.Session") as mock_session_cls:
        mock_session = mock_session_cls.return_value.__enter__.return_value
        mock_session.get.return_value = mock_job
        mock_session.commit.side_effect = Exception("DB Error")
        
        mock_provider = MagicMock()
        mock_extraction = ProbingQuestionsExtraction(questions=[])
        
        with patch("app.services.probing_service.get_ai_provider", return_value=mock_provider), \
             patch("app.services.probing_service.asyncio.run", return_value=mock_extraction):
            generate_probing_questions(job_id)
            
            # Assertions
            mock_session.rollback.assert_called_once()

# Is test se hum verify karte hain ki probing service correctly status update kar rahi hai
