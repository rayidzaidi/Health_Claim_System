from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import models, database
from app.api import deps

router = APIRouter()

@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    total_claims = db.query(models.Claim).count()
    approved_claims = db.query(models.Claim).filter(models.Claim.status == "APPROVED").count()
    rejected_claims = db.query(models.Claim).filter(models.Claim.status == "REJECTED").count()
    pending_claims = db.query(models.Claim).filter(models.Claim.status.in_(["SUBMITTED", "UNDER_REVIEW"])).count()
    flagged_claims = db.query(models.Claim).filter(models.Claim.status == "FLAGGED").count()
    
    total_paid_amount = db.query(func.sum(models.Claim.claim_amount)).filter(models.Claim.status == "APPROVED").scalar() or 0.0
    total_hospitals = db.query(models.Hospital).count()
    total_users = db.query(models.User).count()
    
    return {
        "total_claims": total_claims,
        "approved_claims": approved_claims,
        "rejected_claims": rejected_claims,
        "pending_claims": pending_claims,
        "flagged_claims": flagged_claims,
        "total_paid_amount": total_paid_amount,
        "total_hospitals": total_hospitals,
        "total_users": total_users
    }

@router.get("/claims-by-status")
def get_claims_by_status(db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_admin_user)):
    results = db.query(models.Claim.status, func.count(models.Claim.id)).group_by(models.Claim.status).all()
    return [{"status": r[0], "count": r[1]} for r in results]
