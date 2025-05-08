from os import getenv
from os.path import join, dirname
from dotenv import load_dotenv

envPath= join(dirname(__file__), '..', '.env')

# LOAD ENVIRONMENT VARIABLES
load_dotenv(dotenv_path=envPath)

# DATABASE
URL_DATABASE = getenv("URL_DATABASE")

# AI MODEL
ENDPOINT = getenv("ENDPOINT")


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
        


#DOMAIN
DOMAIN = getenv("DOMAIN")

#REDIS
REDIS_HOST=getenv("REDIS_HOST")
REDIS_PORT=getenv("REDIS_PORT")

#BATCH PREDICTIONS
MAX_BATCH_SIZE = 30

#IMAGE PREDICTION DIRECTORY
PREDICTION_IMAGE_PATH=getenv("PREDICTION_IMAGE_PATH")
