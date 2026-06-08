from app.db.database import SessionLocal
from app.db import models
from app.schemas.claim import ClaimCreate
from app.services import fraud_engine
import uuid

db = SessionLocal()
claim_in = ClaimCreate(
    patient_id=1,
    hospital_id=1,
    policy_id=1,
    diagnosis="Test",
    treatment_type="Test",
    claim_amount=1000,
    treatment_date="2026-06-08"
)

try:
    db_claim = models.Claim(**claim_in.model_dump())
    db_claim.claim_number = f"CLM-{uuid.uuid4().hex[:8].upper()}"
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    
    db_claim = fraud_engine.analyze_claim(db, db_claim)
    print("SUCCESS: ", db_claim.id)
except Exception as e:
    print("ERROR:", str(e))
    import traceback
    traceback.print_exc()
