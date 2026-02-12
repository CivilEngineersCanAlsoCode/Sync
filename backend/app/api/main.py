from fastapi import APIRouter

from app.api.routes import items, jobs, login, private, profiles, resumes, users, utils
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(jobs.router)
api_router.include_router(resumes.router)
api_router.include_router(profiles.router, prefix="/resumes", tags=["profiles"])


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
