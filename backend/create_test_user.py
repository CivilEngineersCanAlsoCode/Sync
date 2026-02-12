from sqlmodel import Session, select
from app.core.db import engine
from app import crud
from app.models import User, UserCreate, UserUpdate

def create_users():
    with Session(engine) as session:
        # 1. Reset admin@example.com
        email = "admin@example.com"
        password = "changethis"
        user = session.exec(select(User).where(User.email == email)).first()
        if user:
            print(f"User {email} found. Resetting password...")
            crud.update_user(session=session, db_user=user, user_in=UserUpdate(password=password))
            print(f"User {email} password reset to '{password}'")
        else:
            print(f"User {email} not found. Creating...")
            user_in = UserCreate(email=email, password=password, is_superuser=True)
            crud.create_user(session=session, user_create=user_in)
            print(f"User {email} created")

        # 2. Create testadmin
        email = "testadmin@example.com"
        password = "TestPassword123!"
        user = session.exec(select(User).where(User.email == email)).first()
        if user:
            print(f"User {email} already exists")
        else:
            user_in = UserCreate(email=email, password=password, is_superuser=True)
            crud.create_user(session=session, user_create=user_in)
            print(f"User {email} created")

if __name__ == "__main__":
    create_users()
