import logging

from sqlalchemy import Engine
from sqlmodel import Session, select
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.core.db import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def init(db_engine: Engine) -> None:
    try:
        with Session(db_engine) as session:
            session.exec(select(1))
    except Exception as e:
        logger.error(
            "%s",
            {
                "error": "Database se connect nahi ho pa rahe hain, please settings check karein",
                "code": "DB_CONN_ERROR",
            },
        )
        raise e
# Ye function retry loop se DB ke jaagne ka intezaar karta hai


def main() -> None:
    logger.info("Initializing service — DB connection check shuru")
    init(engine)
    logger.info("Service finished initializing — Database Connected")
# Ye prestart script hai jo migrations se pehle DB readiness check karti hai


if __name__ == "__main__":
    main()
