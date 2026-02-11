import logging

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr
from sqlmodel import select

from app.api.deps import SessionDep, get_current_active_superuser
from app.models import Message
from app.utils import generate_test_email, send_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/utils", tags=["utils"])


@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")
# Test email bhejne ke liye — sirf superuser ke liye


@router.get("/health-check/")
def health_check(session: SessionDep) -> dict[str, str]:
    try:
        session.exec(select(1))
        return {"status": "healthy", "database": "connected"}
    except Exception:
        logger.error(
            "%s",
            {
                "error": "Database se connect nahi ho pa rahe hain, please settings check karein",
                "code": "DB_CONN_ERROR",
            },
        )
        return {"status": "unhealthy", "database": "disconnected"}
# Ye endpoint DB connection check karta hai — Docker health check isse call karta hai
