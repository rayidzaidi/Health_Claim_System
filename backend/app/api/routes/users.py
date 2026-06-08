from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import models, database
from app.schemas import user as user_schemas
from app.core import security
from app.api import deps
from typing import List

router = APIRouter()

@router.post("/register", response_model=user_schemas.UserResponse)
def register_user(user_in: user_schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = security.get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=hashed_password,
        role=user_in.role,
        phone=user_in.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[user_schemas.UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_admin_user)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users
