from app.db.database import SessionLocal
from app.db import models

db = SessionLocal()
claims = db.query(models.Claim).all()
for c in claims:
    print(f"ID: {c.id}, ClaimNumber: {c.claim_number}")

# Fix it by adding mock claim numbers to the broken ones
for c in claims:
    if not c.claim_number:
        import uuid
        c.claim_number = f"CLM-FIX-{uuid.uuid4().hex[:6].upper()}"
        print(f"Fixed claim {c.id}")
db.commit()
print("Done")
