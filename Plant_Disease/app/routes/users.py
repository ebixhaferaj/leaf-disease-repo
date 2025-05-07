from fastapi import APIRouter, Depends, HTTPException
import os
from app.database.database import db_dependency
from app.services import get_current_user
from app.schemas import UserOut, UpdateUsernameRequest, UpdatePasswordRequest, UpdateEmailRequest
from ..models.user import Users
from fastapi.templating import Jinja2Templates
from app.services import update_user_username, update_current_user_password
from app.services import mail, create_message
from app.core.config import DOMAIN
from app.core import create_url_safe_token,decode_url_safe_token



BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

router = APIRouter(
    prefix="/me",
    tags=["me"]
)


@router.get("/", response_model=UserOut)
async def get_user(user = Depends(get_current_user)):
    return user


@router.put("/update-username", response_model=UserOut)
async def update_username(
    request: UpdateUsernameRequest,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    updated_user = update_user_username(db, current_user, request.new_username)
    
    if not updated_user:
        raise HTTPException(status_code=400, detail="Username update failed.")

    return updated_user




@router.put("/update-current-password", response_model=UserOut)
async def update_current_password(
    request: UpdatePasswordRequest,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    updated_password = update_current_user_password(db, current_user, request.current_password, request.new_password)
    
    if not updated_password:
        raise HTTPException(status_code=400, detail="Password update failed.")

    return updated_password




@router.put("/update-email")
async def update_email(
    request: UpdateEmailRequest,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    if db.query(Users).filter(Users.email == request.new_email).first():
        raise HTTPException(status_code=400, detail="Email is already in use.")

    token = create_url_safe_token({
        "user_id": current_user.id,
        "new_email": request.new_email
    })

    verification_url = f"http://{DOMAIN}/me/confirm-email-update?token={token}"
    html_content = templates.get_template("update_email.html").render(verification_url=verification_url)

    message = create_message(
        recipients=[request.new_email],
        subject="Confirm Email Change",
        body=html_content
    )

    await mail.send_message(message)

    return {"message": "Confirmation link sent to the new email."}




@router.get("/confirm-email-update")
async def confirm_email_update(token: str, db: db_dependency):
    try:
        data = decode_url_safe_token(token)
        user_id = data.get("user_id")
        new_email = data.get("new_email")
    except HTTPException:
        raise

    if db.query(Users).filter(Users.email == new_email).first():
        raise HTTPException(status_code=400, detail="This email is already in use.")

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.email = new_email
    user.is_verified = True
    db.commit()

    return {"message": "Email updated successfully."}
