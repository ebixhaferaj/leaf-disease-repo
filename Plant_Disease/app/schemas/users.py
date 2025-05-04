from pydantic import BaseModel, EmailStr

class UpdateEmailRequest(BaseModel):
    new_email: EmailStr

class UpdateUsernameRequest(BaseModel):
    new_username: str

class UpdatePasswordRequest(BaseModel):
    old_password: str
    new_password: str