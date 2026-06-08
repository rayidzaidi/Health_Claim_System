from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db import models
from app.core.security import get_password_hash
from datetime import date

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if users already exist
    if db.query(models.User).first():
        print("Database already seeded.")
        db.close()
        return

    # Create Admin
    admin = models.User(
        full_name="Admin User",
        email="admin@healthclaim.com",
        password_hash=get_password_hash("Admin@123"),
        role="ADMIN"
    )
    db.add(admin)

    # Create Officer
    officer = models.User(
        full_name="Claim Officer 1",
        email="officer@healthclaim.com",
        password_hash=get_password_hash("Officer@123"),
        role="CLAIM_OFFICER"
    )
    db.add(officer)

    # Create Patient User
    patient_user = models.User(
        full_name="John Doe",
        email="patient@healthclaim.com",
        password_hash=get_password_hash("Patient@123"),
        role="PATIENT"
    )
    db.add(patient_user)

    # Create Hospital User
    hospital_user = models.User(
        full_name="City Hospital",
        email="hospital@healthclaim.com",
        password_hash=get_password_hash("Hospital@123"),
        role="HOSPITAL"
    )
    db.add(hospital_user)

    db.commit()

    # Create Patient profile
    patient = models.Patient(
        user_id=patient_user.id,
        cnic="12345-6789012-3",
        date_of_birth=date(1990, 1, 1),
        gender="Male",
        address="123 Patient St"
    )
    db.add(patient)

    # Create Hospital profile
    hospital = models.Hospital(
        name="City Hospital",
        registration_number="HOSP-001",
        address="456 Hospital Blvd",
        city="Metropolis",
        phone="555-0100"
    )
    db.add(hospital)

    db.commit()

    # Create Policy
    policy = models.Policy(
        policy_number="POL-12345",
        patient_id=patient.id,
        coverage_amount=100000.0,
        remaining_amount=100000.0,
        start_date=date(2025, 1, 1),
        end_date=date(2027, 1, 1),
        covered_diseases="General, Surgery",
        claim_limit_per_case=25000.0
    )
    db.add(policy)
    
    db.commit()
    print("Database seeded successfully.")
    db.close()

if __name__ == "__main__":
    seed_data()
