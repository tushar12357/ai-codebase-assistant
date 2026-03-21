import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY", "secret")
    ALGORITHM = "HS256"

    NODE_TOOL_SERVER = os.getenv("NODE_TOOL_SERVER", "http://localhost:4000")

settings = Settings()