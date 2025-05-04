from pydantic import BaseModel, EmailStr

class CreateUserRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str

class AccessTokenRequest(BaseModel):
    access_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class EmailSchema(BaseModel):
    addresses: list[str]

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    new_password: str
    confirm_password: str