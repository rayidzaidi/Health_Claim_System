from fastapi import APIRouter
from . import auth, claims, hospitals, policies, reports

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(claims.router, prefix="/claims", tags=["claims"])
api_router.include_router(hospitals.router, prefix="/hospitals", tags=["hospitals"])
api_router.include_router(policies.router, prefix="/policies", tags=["policies"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
