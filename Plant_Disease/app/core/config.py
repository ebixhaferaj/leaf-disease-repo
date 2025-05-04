from os import getenv
from os.path import join, dirname
from dotenv import load_dotenv

envPath= join(dirname(__file__), '..', '.env')

# Load environment variables from .env file
load_dotenv(dotenv_path=envPath)

# DATABASE
URL_DATABASE = getenv("URL_DATABASE")

# AI MODEL
ENDPOINT = getenv("ENDPOINT")

CLASS_NAMES = [
    'Background_without_leaves', 
    'Corn__Gray_Leaf_Spot', 
    'Corn__Healthy',
    'Corn__Northern_Leaf_Blight',
    'Grape__Downey_Mildew',
    'Grape__Healthy',
    'Grape__Powdery_Mildew',
    'Olive__Healthy',
    'Olive__Peacock_Spot',
    'Olive__Rust_Mite',
    'Potato__Early_Blight',
    'Potato__Healthy',
    'Potato__Late_blight',
    'Tomato__Early_blight',
    'Tomato__Healthy',
    'Tomato__Late_Blight',
    'Wheat__Healthy',
    'Wheat__Septoria',
    'Wheat__Yellow_Rust'
]

#TOKEN
SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 20
REFRESH_TOKEN_EXPIRE_DAYS=7

#EMAIL SERVICE
class Email:
    def __init__(self):
        self.MAIL_USERNAME = getenv("MAIL_USERNAME")
        self.MAIL_PASSWORD = getenv("MAIL_PASSWORD")
        self.MAIL_SERVER = getenv("MAIL_SERVER")
        self.MAIL_PORT = getenv("MAIL_PORT")
        self.MAIL_FROM = getenv("MAIL_FROM")
        self.MAIL_FROM_NAME = getenv("MAIL_FROM_NAME")
        

email_service = Email()


#DOMAIN
DOMAIN = getenv("DOMAIN")

#REDIS
REDIS_HOST=getenv("REDIS_HOST")
REDIS_PORT=getenv("REDIS_PORT")

#BATCH PREDICTIONS
MAX_BATCH_SIZE = 30

#IMAGE PREDICTION DIRECTORY
PREDICTION_IMAGE_PATH=getenv("PREDICTION_IMAGE_PATH")