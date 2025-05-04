from sqlalchemy.orm import Session
from ..models.user import Users
from ..core import hash_password

def get_user_by_email(db: Session, email: str) -> Users:
    return db.query(Users).filter(Users.email == email).first()

def update_user_password(db: Session, user: Users, new_password: str) -> Users:
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user