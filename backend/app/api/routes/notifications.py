from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import models, database
from app.schemas import notification as notification_schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[notification_schemas.NotificationResponse])
def get_notifications(skip: int = 0, limit: int = 50, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    notifications = db.query(models.Notification).filter(models.Notification.user_id == current_user.id).order_by(models.Notification.created_at.desc()).offset(skip).limit(limit).all()
    return notifications

@router.put("/{notification_id}/read", response_model=notification_schemas.NotificationResponse)
def mark_notification_read(notification_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id, models.Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@router.put("/read-all", response_model=dict)
def mark_all_notifications_read(db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
