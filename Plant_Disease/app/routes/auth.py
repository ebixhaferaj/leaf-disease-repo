# Standard Library
from datetime import timedelta

# Third-Party Libraries
from fastapi.responses import RedirectResponse
from fastapi import APIRouter, HTTPException, Depends
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer
from starlette import status
from jose import jwt, JWTError
from passlib.context import CryptContext

# Local Application Imports
from app.schemas import (CreateUserRequest, 
                         Token, 
                         LoginRequest, 
                         RefreshTokenRequest, 
                         AccessTokenRequest, 
                         PasswordResetRequest, 
                         PasswordResetConfirm)
from app.services import (mail, 
                          create_message, 
                          add_jti_to_blocklist, 
                          authenticate_user, 
                          get_user_by_email,
                          update_user_password)
from app.core.config import (SECRET_KEY, 
                             ALGORITHM, 
                             ACCESS_TOKEN_EXPIRE_MINUTES, 
                             DOMAIN, 
                             REFRESH_TOKEN_EXPIRE_DAYS)
from app.core import (hash_password, 
                      validate_password, 
                      create_access_token, 
                      create_url_safe_token, 
                      create_refresh_token, 
                      decode_url_safe_token)

# Relative Imports
from ..database import db_dependency
from ..models.user import Users

import os



router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

# Creating a passowrd hashing system using bcrypt
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

# Template Rendering
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Register
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    validate_password(create_user_request.password)

    # Check if user exists
    existing_email = db.query(Users).filter(Users.email == create_user_request.email).first()
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already registered.")
    existing_username = db.query(Users).filter(Users.username == create_user_request.username).first()
    if existing_username:
        raise HTTPException(status_code=409, detail="Username taken.")
    
    create_user_model = Users(
        username=create_user_request.username,
        email=create_user_request.email,
        hashed_password=hash_password(create_user_request.password),
        role=create_user_request.role,
        is_verified=False
    )

    
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)

    # Email verification model
    token = create_url_safe_token({"email":create_user_model.email})

    verification_url = f"http://{DOMAIN}/auth/verify-email?token={token}"

    html_content = templates.get_template("validation_email.html").render(verification_url=verification_url)

    message = create_message(
        recipients=[create_user_model.email],
        subject="Email Validation",
        body=html_content
    )

    await mail.send_message(message)

    return {"message": "User created. Please verify your email to activate your account."}



# Verify Email
@router.get("/verify-email")
async def verify_email(token: str, db: db_dependency):
    try:
        token_data = decode_url_safe_token(token)
        email = token_data.get("email")
    except HTTPException:
        raise

    try:
        user = db.query(Users).filter(Users.email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        if user.is_verified:
            return RedirectResponse(url="http://localhost:5173/verify-email?status=already_verified")
        
        user.is_verified = True
        db.commit()

        return RedirectResponse(url="http://localhost:5173/verify-email?status=success")

    except jwt.ExpiredSignatureError:
        return RedirectResponse(url="http://localhost:5173/verify-email?status=expired")

# Login Token
@router.post("/token", response_model=Token)
async def login_for_access_token(
    login_data: LoginRequest,
    db: db_dependency):

    user = authenticate_user(login_data.email, login_data.password, login_data.role, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    access_token = create_access_token(user.email, user.id, user.role, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_refresh_token(user.email, user.id, user.role, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

    return {'access_token': access_token, 'refresh_token': refresh_token, 'token_type': 'bearer'}

# Logout
@router.post("/logout")
async def logout(access_token_request: AccessTokenRequest):
    try:
        payload = jwt.decode(access_token_request.access_token, SECRET_KEY, algorithms=[ALGORITHM])

        jti = payload.get("jti")
        if jti is None:
            raise HTTPException(status_code=400, detail="Invalid token: Missing JTI")
        
        await add_jti_to_blocklist(jti)

        return {"message": "Successfully logged out."}
    
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token.") from exc

# Refresh route, new access token
@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    try:
        payload = jwt.decode(request.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("scope") != "refresh_token":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token scope")
        
        email: str = payload.get("sub")
        user_id: int = payload.get("id")
        role : str = payload.get("role")
        
        if email is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token data")
        
        # Generate a new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(email, user_id, role, access_token_expires)
        
        return {"access_token": new_access_token, "token_type": "bearer"}
    
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc


@router.post('/password-reset-request')
async def password_reset_request(email_data: PasswordResetRequest):
    email = email_data.email

    # Email verification model
    token = create_url_safe_token({"email": email})

    # Generate the verification URL
    verification_url = f"http://{DOMAIN}/auth/password-reset-confirm/{token}"

    # Render the HTML template and pass verification URL
    html_content = templates.get_template("reset_password.html").render(verification_url=verification_url)

    # Create and send email message
    message = create_message(
        recipients=[email],
        subject="Reset Password",
        body=html_content
    )

    await mail.send_message(message)

    return {"message": "Please check your email for instructions to reset your password"}


@router.post('/password-reset-confirm/{token}')
async def reset_account_password(
    token: str, 
    password: PasswordResetConfirm,
    db: db_dependency):

    if password.new_password != password.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords don't match")
    
    token_data = decode_url_safe_token(token)
    user_email = token_data.get("email")

    if not user_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    user = get_user_by_email(db, user_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    update_user_password(db, user, password.new_password)

    return {"message": "Password updated successfully"}