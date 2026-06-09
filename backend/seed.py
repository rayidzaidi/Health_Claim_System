from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db import models
from app.core.security import get_password_hash
from datetime import date, datetime, timedelta, timezone

def seed_data():
    # Recreate tables
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if data already exists, clear it if we want a fresh seed
    # Since we want to load a fresh rich dataset, we'll clear existing records
    print("Clearing old records for a fresh seed...")
    db.query(models.AuditLog).delete()
    db.query(models.Notification).delete()
    db.query(models.Payment).delete()
    db.query(models.FraudFlag).delete()
    db.query(models.ClaimDocument).delete()
    db.query(models.Claim).delete()
    db.query(models.Policy).delete()
    db.query(models.Patient).delete()
    db.query(models.Hospital).delete()
    db.query(models.User).delete()
    db.commit()

    print("Creating core system users...")
    # 1. Create Admins & Officers
    admin = models.User(
        full_name="Admin User",
        email="admin@healthclaim.com",
        password_hash=get_password_hash("Admin@123"),
        role="ADMIN"
    )
    db.add(admin)

    officer1 = models.User(
        full_name="Sarah Connor (Officer)",
        email="officer@healthclaim.com",
        password_hash=get_password_hash("Officer@123"),
        role="CLAIM_OFFICER"
    )
    officer2 = models.User(
        full_name="John Miller (Senior Auditor)",
        email="officer2@healthclaim.com",
        password_hash=get_password_hash("Officer@123"),
        role="CLAIM_OFFICER"
    )
    db.add(officer1)
    db.add(officer2)

    # 2. Create Hospitals
    hospitals_data = [
        {"name": "City Hospital", "reg": "HOSP-001", "city": "Metropolis", "phone": "555-0100", "email": "hospital@healthclaim.com"},
        {"name": "Metro General Hospital", "reg": "HOSP-002", "city": "Gotham", "phone": "555-0200", "email": "metro@healthclaim.com"},
        {"name": "St. Jude Medical Center", "reg": "HOSP-003", "city": "Star City", "phone": "555-0300", "email": "stjude@healthclaim.com"},
    ]
    hospitals = []
    for h in hospitals_data:
        h_user = models.User(
            full_name=h["name"] + " Portal",
            email=h["email"],
            password_hash=get_password_hash("Hospital@123"),
            role="HOSPITAL"
        )
        db.add(h_user)
        db.flush() # get user id
        
        hospital = models.Hospital(
            name=h["name"],
            registration_number=h["reg"],
            address=f"123 {h['name']} Rd",
            city=h["city"],
            phone=h["phone"],
            risk_score=0.0
        )
        db.add(hospital)
        hospitals.append(hospital)

    # 3. Create Patients (12 patients)
    patients_raw = [
        {"name": "John Doe", "email": "patient@healthclaim.com", "cnic": "12345-6789012-3", "dob": date(1990, 1, 1), "gender": "Male"},
        {"name": "Jane Smith", "email": "jane@healthclaim.com", "cnic": "11111-2222222-3", "dob": date(1985, 5, 12), "gender": "Female"},
        {"name": "Robert Downey", "email": "robert@healthclaim.com", "cnic": "33333-4444444-3", "dob": date(1975, 10, 20), "gender": "Male"},
        {"name": "Emily Blunt", "email": "emily@healthclaim.com", "cnic": "55555-6666666-3", "dob": date(1993, 3, 15), "gender": "Female"},
        {"name": "Michael Jordan", "email": "michael@healthclaim.com", "cnic": "77777-8888888-3", "dob": date(1963, 2, 17), "gender": "Male"},
        {"name": "Clara Oswald", "email": "clara@healthclaim.com", "cnic": "99999-0000000-3", "dob": date(1996, 8, 8), "gender": "Female"},
        {"name": "David Tennant", "email": "david@healthclaim.com", "cnic": "22222-3333333-3", "dob": date(1971, 4, 18), "gender": "Male"},
        {"name": "Bruce Wayne", "email": "bruce@healthclaim.com", "cnic": "44444-5555555-3", "dob": date(1980, 11, 19), "gender": "Male"},
        {"name": "Diana Prince", "email": "diana@healthclaim.com", "cnic": "66666-7777777-3", "dob": date(1988, 6, 25), "gender": "Female"},
        {"name": "Peter Parker", "email": "peter@healthclaim.com", "cnic": "88888-9999999-3", "dob": date(2001, 10, 10), "gender": "Male"},
        {"name": "Wanda Maximoff", "email": "wanda@healthclaim.com", "cnic": "99999-8888888-3", "dob": date(1989, 2, 10), "gender": "Female"},
        {"name": "Tony Stark", "email": "tony@healthclaim.com", "cnic": "11111-9999999-3", "dob": date(1970, 5, 29), "gender": "Male"},
    ]

    patients = []
    policies = []
    
    print("Seeding patient profiles and policies...")
    for idx, p in enumerate(patients_raw):
        p_user = models.User(
            full_name=p["name"],
            email=p["email"],
            password_hash=get_password_hash("Patient@123"),
            role="PATIENT"
        )
        db.add(p_user)
        db.flush()
        
        patient = models.Patient(
            user_id=p_user.id,
            cnic=p["cnic"],
            date_of_birth=p["dob"],
            gender=p["gender"],
            address=f"Street {idx + 1}, Sector {chr(65 + (idx % 4))}, City"
        )
        db.add(patient)
        db.flush()
        patients.append(patient)
        
        # Create Policy for each patient
        coverage = 100000.0 if idx % 2 == 0 else 250000.0
        # Make one policy expired to test validation
        is_expired = (idx == 11) # Tony Stark's policy is expired
        start_d = date(2020, 1, 1) if is_expired else date(2025, 1, 1)
        end_d = date(2023, 1, 1) if is_expired else date(2028, 1, 1)
        status = "EXPIRED" if is_expired else "ACTIVE"
        
        policy = models.Policy(
            policy_number=f"POL-{(10000 + idx):05d}",
            patient_id=patient.id,
            coverage_amount=coverage,
            used_amount=0.0,
            remaining_amount=coverage,
            start_date=start_d,
            end_date=end_d,
            status=status,
            covered_diseases="General, Surgery, Cardiology, Oncology, Orthopedics",
            claim_limit_per_case=50000.0 if idx % 2 == 0 else 100000.0
        )
        db.add(policy)
        policies.append(policy)

    db.commit()

    # Refresh data from database
    hospitals = db.query(models.Hospital).all()
    patients = db.query(models.Patient).all()
    policies = db.query(models.Policy).all()

    print("Generating rich claim data...")
    # 4. Create Claims with diverse states
    # We will define a list of claims to create
    claims_data = [
        # (PatientIdx, HospitalIdx, PolicyIdx, diagnosis, treatment, amount, status, fraud_score, fraud_risk, remarks)
        
        # 1. Approved Claims (with Payments)
        (0, 0, 0, "Acute Appendicitis (K35.8)", "Appendectomy", 12000.0, "APPROVED", 12.5, "LOW", "Standard appendectomy. Clinical data aligns with treatment."),
        (1, 1, 1, "Type 2 Diabetes Mellitus (E11.9)", "Inpatient Glycemic Stabilization", 8500.0, "APPROVED", 8.0, "LOW", "Managed hyperglycemia successfully. Standard protocol."),
        (2, 2, 2, "Osteoarthritis Hip (M16.1)", "Total Hip Replacement", 45000.0, "APPROVED", 15.0, "LOW", "Total hip replacement approved after reviewing X-Rays."),
        
        # 2. Rejected Claims
        (3, 0, 3, "Cosmetic Rhinoplasty (J34.2)", "Septorhinoplasty", 35000.0, "REJECTED", 85.0, "HIGH", "Claim rejected. Cosmetic procedures are not covered under Policy terms."),
        (4, 1, 4, "Essential Hypertension (I10)", "Outpatient General Assessment", 1500.0, "REJECTED", 40.0, "MEDIUM", "Rejected. Outpatient wellness visits must be submitted under basic wellness rider, not surgical policy."),
        
        # 3. Under Review Claims
        (5, 2, 5, "Gallstones with Cholecystitis (K80.2)", "Laparoscopic Cholecystectomy", 18500.0, "UNDER_REVIEW", 22.0, "LOW", "Under clinical review of surgeon's logs."),
        (6, 0, 6, "Lumbar Disc Herniation (M51.2)", "Microdiscectomy Surgery", 28000.0, "UNDER_REVIEW", 30.0, "MEDIUM", "Under audit review for billing adjustments."),
        
        # 4. Document Required Claims
        (7, 1, 7, "Coronary Artery Disease (I25.1)", "Coronary Angioplasty", 49000.0, "DOCUMENT_REQUIRED", 18.0, "LOW", "Requires high-resolution ECG reports and original pharmacy invoices."),
        
        # 5. Flagged Claims (High Risk / Fraud Suspected)
        # Case A: Hospital billing code inflation (Upcoding)
        (8, 2, 8, "Simple Migraine (G43.9)", "Intensive Care Treatment (Upcoded)", 42000.0, "FLAGGED", 92.5, "HIGH", "Automated system flagged: Discrepancy between diagnosis (Migraine) and treatment/billing (ICU admission)."),
        # Case B: Treatment date prior to policy start date (Pre-dating fraud)
        (9, 0, 9, "Fracture of Radius (S52.5)", "ORIF Surgery", 22000.0, "FLAGGED", 88.0, "HIGH", "System flagged: Claim date overlaps with prior inactive timeline / suspicious accident timeline."),
        
        # 6. Submitted Claims (Fresh / Untouched)
        (10, 1, 10, "Pneumonia, unspecified organism (J18.9)", "Inpatient Oxygenation & Antibiotics", 6200.0, "SUBMITTED", 5.0, "LOW", None),
        (0, 2, 0, "Inguinal Hernia (K40.9)", "Herniorrhaphy", 14500.0, "SUBMITTED", 15.0, "LOW", None),
        (2, 0, 2, "Cataract (H26.9)", "Phacoemulsification with IOL", 9500.0, "SUBMITTED", 10.0, "LOW", None),
    ]

    for idx, c in enumerate(claims_data):
        p_idx, h_idx, pol_idx, diagnosis, treatment, amount, status, f_score, f_risk, remarks = c
        patient = patients[p_idx]
        hospital = hospitals[h_idx]
        policy = policies[pol_idx]
        
        treatment_d = date.today() - timedelta(days=(10 + idx * 5))
        
        claim = models.Claim(
            claim_number=f"CLM-{idx + 1001:04d}",
            patient_id=patient.id,
            hospital_id=hospital.id,
            policy_id=policy.id,
            diagnosis=diagnosis,
            treatment_type=treatment,
            claim_amount=amount,
            treatment_date=treatment_d,
            admission_date=treatment_d - timedelta(days=1),
            discharge_date=treatment_d + timedelta(days=2),
            status=status,
            fraud_score=f_score,
            fraud_risk_level=f_risk,
            ml_prediction="FRAUD" if f_score > 60 else "LEGITIMATE",
            officer_remarks=remarks
        )
        db.add(claim)
        db.flush()
        
        # Create corresponding objects depending on status
        # If Approved, create Payment and deduct remaining policy amount
        if status == "APPROVED":
            claim.approved_amount = amount
            # Deduct policy amount
            policy.used_amount += amount
            policy.remaining_amount -= amount
            
            payment = models.Payment(
                claim_id=claim.id,
                amount=amount,
                payment_status="PAID",
                payment_date=date.today() - timedelta(days=(5 + idx)),
                transaction_reference=f"TXN-{idx + 10001:05d}"
            )
            db.add(payment)
            
        elif status == "REJECTED":
            claim.approved_amount = 0.0
            
        elif status == "FLAGGED" and f_score > 80:
            # Create fraud flags to explain the flag
            flag1 = models.FraudFlag(
                claim_id=claim.id,
                flag_type="UPCODING" if "ICU" in treatment else "TIMELINE_MISMATCH",
                description="High billing cost relative to historical standard for this diagnosis." if "ICU" in treatment else "Treatment date is suspicious relative to policy activation window.",
                risk_points=f_score
            )
            db.add(flag1)
            
        elif status == "DOCUMENT_REQUIRED":
            # Create a notification for the patient
            notif = models.Notification(
                user_id=patient.user_id,
                message=f"Additional documents required for claim {claim.claim_number}. Remarks: {remarks}"
            )
            db.add(notif)
            
        # Add notifications for statuses
        if status in ["APPROVED", "REJECTED"]:
            notif = models.Notification(
                user_id=patient.user_id,
                message=f"Your claim {claim.claim_number} status has been updated to {status}."
            )
            db.add(notif)

    db.commit()

    # Update hospital risk scores based on flagged claims
    print("Recalculating hospital fraud risk scores...")
    for h in hospitals:
        total_claims = db.query(models.Claim).filter(models.Claim.hospital_id == h.id).count()
        flagged_claims = db.query(models.Claim).filter(models.Claim.hospital_id == h.id, models.Claim.status == "FLAGGED").count()
        if total_claims > 0:
            h.risk_score = round((flagged_claims / total_claims) * 100, 1)
        else:
            h.risk_score = 0.0
            
    db.commit()
    print("Database seeded with rich dataset successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
