from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime, timezone
import random

def calculate_rule_based_score(db: Session, claim: models.Claim) -> tuple[float, list[str]]:
    score = 0.0
    reasons = []

    # 1. Claim amount is unusually high (High Severity)
    if claim.claim_amount > 100000:
        score += 45
        reasons.append("Claim amount is exceptionally high (>100k)")
    elif claim.claim_amount > 50000:
        score += 25
        reasons.append("Claim amount is unusually high for standard treatments (>50k)")

    # 2. Multiple claims submitted by same patient within a short period
    recent_claims = db.query(models.Claim).filter(
        models.Claim.patient_id == claim.patient_id,
        models.Claim.id != claim.id,
        models.Claim.created_at >= datetime.now(timezone.utc).replace(day=1)
    ).count()
    if recent_claims >= 3:
        score += 35
        reasons.append("High frequency: 3 or more claims submitted recently")
    elif recent_claims == 2:
        score += 20
        reasons.append("Moderate frequency: 2 claims submitted recently")

    # 3. Hospital has high risk score
    if claim.hospital and claim.hospital.risk_score > 75:
        score += 40
        reasons.append("Hospital is marked as high-risk entity")
    elif claim.hospital and claim.hospital.risk_score > 40:
        score += 15
        reasons.append("Hospital has an elevated risk score")

    # 4. Treatment duration anomalies (if admission and discharge dates are present)
    if claim.admission_date and claim.discharge_date:
        duration = (claim.discharge_date - claim.admission_date).days
        if duration == 0 and claim.claim_amount > 10000:
            score += 30
            reasons.append("Same-day discharge with very high claim amount")
        elif duration > 30:
            score += 20
            reasons.append("Unusually long hospitalization (>30 days)")

    # 5. Inconsistent Treatment Type
    high_risk_treatments = ["Cosmetic Surgery", "Experimental Therapy", "Alternative Medicine"]
    if claim.treatment_type in high_risk_treatments:
        score += 25
        reasons.append("Treatment type is flagged as high-risk or commonly excluded")

    # Cap at 100
    final_score = min(score, 100.0)
    return final_score, reasons

def get_risk_level(score: float) -> str:
    if score <= 25:
        return "LOW"
    elif score <= 60:
        return "MEDIUM"
    else:
        return "HIGH"

def analyze_claim(db: Session, claim: models.Claim):
    score, reasons = calculate_rule_based_score(db, claim)
    risk_level = get_risk_level(score)
    
    # Deterministic Mock ML Prediction based on combinations of factors
    # We avoid random() to keep it deterministic per the scope requirements
    ml_pred = "LEGITIMATE"
    if risk_level == "HIGH" or (score > 50 and claim.claim_amount > 75000):
        ml_pred = "SUSPICIOUS_PATTERN"
    elif score > 80:
        ml_pred = "HIGH_PROBABILITY_FRAUD"

    claim.fraud_score = score
    claim.fraud_risk_level = risk_level
    claim.ml_prediction = ml_pred

    if risk_level == "HIGH":
        claim.status = "FLAGGED"
    else:
        claim.status = "UNDER_REVIEW"
        
    db.commit()

    # Save reasons to FraudFlags table
    for reason in reasons:
        flag = models.FraudFlag(
            claim_id=claim.id,
            flag_type="RULE_BASED",
            description=reason,
            risk_points=0 
        )
        db.add(flag)
    
    db.commit()
    return claim
