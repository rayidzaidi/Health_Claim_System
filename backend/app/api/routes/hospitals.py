from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import models, database
from app.schemas import hospital as hospital_schemas
from app.api import deps
from typing import List

router = APIRouter()

@router.post("/", response_model=hospital_schemas.HospitalResponse)
def create_hospital(hospital_in: hospital_schemas.HospitalCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_admin_user)):
    db_hospital = models.Hospital(**hospital_in.model_dump())
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    return db_hospital

@router.get("/", response_model=List[hospital_schemas.HospitalResponse])
def get_hospitals(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    hospitals = db.query(models.Hospital).offset(skip).limit(limit).all()
    return hospitals
