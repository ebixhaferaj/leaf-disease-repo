from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from app.core.config import Email
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

email_config = Email()

mail_config = ConnectionConfig(
    MAIL_USERNAME=email_config.MAIL_USERNAME,
    MAIL_PASSWORD=email_config.MAIL_PASSWORD,
    MAIL_FROM=email_config.MAIL_FROM,
    MAIL_PORT=email_config.MAIL_PORT,
    MAIL_SERVER=email_config.MAIL_SERVER,
    MAIL_FROM_NAME=email_config.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,  
    TEMPLATE_FOLDER=Path(BASE_DIR, 'templates')
)

mail = FastMail(config=mail_config)

# Email creation
def create_message(recipients: list[str], subject: str, body: str):
    message = MessageSchema(
        recipients=recipients,
        subject=subject,
        body=body,
        subtype=MessageType.html
    )
    return message
