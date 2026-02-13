from sqlmodel import Session, select
from app.core.db import engine
from app import crud, models
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_admin():
    email = "admin@example.com"
    password = "Microsoft!098"
    
    with Session(engine) as session:
        user = session.exec(select(models.User).where(models.User.email == email)).first()
        if user:
            logger.info(f"Updating password for {email}")
            crud.update_user(session=session, db_user=user, user_in=models.UserUpdate(password=password))
            logger.info("Password updated successfully")
        else:
            logger.info(f"User {email} not found. Creating...")
            user_in = models.UserCreate(
                email=email,
                password=password,
                is_superuser=True,
                is_active=True
            )
            crud.create_user(session=session, user_create=user_in)
            logger.info("User created successfully")

if __name__ == "__main__":
    update_admin()
