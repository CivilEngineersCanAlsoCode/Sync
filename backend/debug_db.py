
from sqlmodel import Session, select
from app.core.db import engine
from app.models import User
from app.core.config import settings

def debug_user():
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
        if user:
            print(f"User found: {user.email}")
            print(f"Hashed password: {user.hashed_password}")
            print(f"Is active: {user.is_active}")
            print(f"Is superuser: {user.is_superuser}")
        else:
            print("Superuser not found!")

if __name__ == "__main__":
    debug_user()
