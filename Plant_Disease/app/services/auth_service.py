from typing import Optional, Dict
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from app.models.user import Users
from app.core.config import SECRET_KEY, ALGORITHM
from app.core import verify_password
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from typing_extensions import Annotated
from app.services import token_in_blocklist
from app.database.database import get_db


oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

# User Authentication
def authenticate_user(email: str, password: str, role: str, db) -> Optional[Users]:
    user = db.query(Users).filter(
        Users.email == email, 
        Users.role == role, 
        Users.is_verified == True
    ).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


# Get Logged User
async def get_current_user(
        token: Annotated[str, Depends(oauth2_bearer)],
        db: Session = Depends(get_db)) -> Users:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        jti = payload.get("jti")
        if await token_in_blocklist(jti):
            raise HTTPException(status_code=401, detail="Token revoked.")
        
        user_id: int = payload.get('id')
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token.")

        user = db.query(Users).filter(Users.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found.")

        return user 

    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Token invalid.") from exc

# Check user Role
class RoleChecker:
    def __init__(self, allowed_roles: list[str]):

        self.allowed_roles = allowed_roles

    async def __call__(self, current_user: Users = Depends(get_current_user)):

        if current_user.role in self.allowed_roles:
            return True
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")
    
