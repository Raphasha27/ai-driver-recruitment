from sqlalchemy.orm import Session
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, company_name=user.company_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_drivers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Driver).offset(skip).limit(limit).all()

def create_driver(db: Session, driver: schemas.DriverCreate, user_id: int):
    # Mock AI Score logic
    ai_score = 85
    ai_notes = "Great experience. Strong candidate for delivery."
    
    db_driver = models.Driver(**driver.dict(), owner_id=user_id, ai_score=ai_score, ai_notes=ai_notes)
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver
