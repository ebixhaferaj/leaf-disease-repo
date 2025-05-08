from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
import re
from .config import SECRET_KEY, ALGORITHM
from itsdangerous import URLSafeTimedSerializer
from uuid import uuid4

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

password_regex = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'

# Hash password
def hash_password(password: str) -> str:
    return bcrypt_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt_context.verify(plain_password, hashed_password)

# Validate password
def validate_password(password: str):
    if not re.match(password_regex, password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.")

# Access Token
def create_access_token(email: str, user_id: int, role: str, expires_delta: timedelta):
    encode = {'sub': email, 
              'id': user_id,
              'role': role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires, "jti": str(uuid4())})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

# Refresh Token
def create_refresh_token(email: str, user_id: int, role: str, expires_delta: timedelta):
    encode = {'sub': email, 
              'id': user_id,
              'role': role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires, "jti": str(uuid4()), 'scope': 'refresh_token'})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

url_token_serializer = URLSafeTimedSerializer(
    secret_key=SECRET_KEY,
    salt="email_configuration"
)

# Create token for Email
def create_url_safe_token(data: dict):
    token = url_token_serializer.dumps(data)

    return token

def decode_url_safe_token(token: str, max_age: int = 3600):
    try:
        token_data = url_token_serializer.loads(token, max_age=max_age)
        return token_data
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token could not be decoded or has expired."
        ) from exc
    