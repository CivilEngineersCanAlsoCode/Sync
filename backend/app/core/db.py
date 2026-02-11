import logging

from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User, UserCreate

logger = logging.getLogger(__name__)

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
# Ye engine Postgres se baat karne ka primary channel hai


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def verify_db_connection() -> bool:
    try:
        with Session(engine) as session:
            session.exec(select(1))
        logger.info("Database Connected")
        return True
    except Exception as e:
        logger.error(
            "Database connection failed: %s",
            {
                "error": "Database se connect nahi ho pa rahe hain, please settings check karein",
                "code": "DB_CONN_ERROR",
            },
        )
        raise ConnectionError(
            '{"error": "Database se connect nahi ho pa rahe hain, please settings check karein", "code": "DB_CONN_ERROR"}'
        ) from e
# Is function se hum app start hone par DB connection verify karte hain


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)
# Is function se pehla superuser create hota hai agar wo exist nahi karta
