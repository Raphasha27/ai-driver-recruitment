from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Driver Schemas
class DriverBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    vehicle_type: str
    experience_years: int

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    status: Optional[str] = None
    ai_score: Optional[int] = None
    ai_notes: Optional[str] = None

class Driver(DriverBase):
    id: int
    status: str
    ai_score: Optional[int] = None
    ai_notes: Optional[str] = None
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    company_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
