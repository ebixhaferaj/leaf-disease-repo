from sqlalchemy.orm import Session
from ..models.user import Users
from ..core import hash_password, verify_password
from sqlalchemy.future import select
from fastapi import HTTPException


# Filter user by email
def get_user_by_email(db: Session, email: str) -> Users:
    return db.query(Users).filter(Users.email == email).first()

# Update password for Forgot Password Request
def update_user_password(db: Session, user: Users, new_password: str) -> Users:
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user

# Update Username
def update_user_username(db: Session, user: Users, new_username: str) -> Users:
    
    query = select(Users).filter(Users.username == new_username)
    result = db.execute(query)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username taken.")
    
    user.username = new_username

    db.commit()
    db.refresh(user)
    
    return user

# Update Password for Change Password Request
def update_current_user_password(db: Session, user: Users, current_password: str, new_password: str) -> Users:
    
    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password.")
    
    user.hashed_password = hash_password(new_password)

    db.commit()
    db.refresh(user)

    return user
