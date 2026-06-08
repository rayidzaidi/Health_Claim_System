from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Date, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # ADMIN, CLAIM_OFFICER, HOSPITAL, PATIENT
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    cnic = Column(String, unique=True, index=True)
    date_of_birth = Column(Date)
    gender = Column(String)
    address = Column(String)
    user = relationship("User")

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    registration_number = Column(String, unique=True, index=True)
    address = Column(String)
    city = Column(String)
    phone = Column(String)
    risk_score = Column(Float, default=0.0)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Policy(Base):
    __tablename__ = "policies"
    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(String, unique=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    coverage_amount = Column(Float)
    used_amount = Column(Float, default=0.0)
    remaining_amount = Column(Float)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String, default="ACTIVE")
    covered_diseases = Column(String)
    claim_limit_per_case = Column(Float)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    patient = relationship("Patient")

class Claim(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True, index=True)
    claim_number = Column(String, unique=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    policy_id = Column(Integer, ForeignKey("policies.id"))
    diagnosis = Column(String)
    treatment_type = Column(String)
    claim_amount = Column(Float)
    approved_amount = Column(Float, nullable=True)
    treatment_date = Column(Date)
    admission_date = Column(Date, nullable=True)
    discharge_date = Column(Date, nullable=True)
    status = Column(String, default="SUBMITTED") # SUBMITTED, UNDER_REVIEW, FLAGGED, APPROVED, REJECTED, PAYMENT_PROCESSING, PAID, DOCUMENT_REQUIRED
    fraud_score = Column(Float, nullable=True)
    fraud_risk_level = Column(String, nullable=True) # LOW, MEDIUM, HIGH
    ml_prediction = Column(String, nullable=True)
    officer_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    patient = relationship("Patient")
    hospital = relationship("Hospital")
    policy = relationship("Policy")
    fraud_flags = relationship("FraudFlag", backref="claim")

class ClaimDocument(Base):
    __tablename__ = "claim_documents"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"))
    file_name = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class FraudFlag(Base):
    __tablename__ = "fraud_flags"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"))
    flag_type = Column(String)
    description = Column(String)
    risk_points = Column(Float)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"))
    amount = Column(Float)
    payment_status = Column(String)
    payment_date = Column(Date, nullable=True)
    transaction_reference = Column(String, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    entity_type = Column(String)
    entity_id = Column(Integer)
    details = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

