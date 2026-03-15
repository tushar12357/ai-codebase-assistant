import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    NODE_TOOL_SERVER = os.getenv("NODE_TOOL_SERVER", "http://localhost:4000")
    MODEL = os.getenv("MODEL", "llama-3.3-70b-versatile")
    TEMPERATURE = float(os.getenv("TEMPERATURE", 0))


settings = Settings()