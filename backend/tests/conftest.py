from collections.abc import Generator

from dotenv import load_dotenv, find_dotenv
# Load .env file before importing app components that rely on settings
load_dotenv(find_dotenv(usecwd=True), verbose=True)
import os
os.environ["POSTGRES_SERVER"] = "localhost"

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, delete

from app.core.config import settings
from app.main import app
from app.models import Item, User
from tests.utils.user import authentication_token_from_email
from tests.utils.utils import get_superuser_token_headers


@pytest.fixture(scope="session", autouse=True)
def db_engine():
    settings.POSTGRES_SERVER = "localhost"
    from app.core.db import engine
    return engine


@pytest.fixture(scope="session", autouse=True)
def db(db_engine) -> Generator[Session, None, None]:
    from app.core.db import init_db
    with Session(db_engine) as session:
        init_db(session)
        yield session
        statement = delete(Item)
        session.execute(statement)
        statement = delete(User)
        session.execute(statement)
        session.commit()


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
def normal_user_token_headers(client: TestClient, db: Session) -> dict[str, str]:
    return authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )


@pytest.fixture(scope="module")
def superuser(db: Session) -> User:
    from app import crud
    user = crud.get_user_by_email(session=db, email=settings.FIRST_SUPERUSER)
    return user
