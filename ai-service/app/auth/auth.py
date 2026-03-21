from jose import jwt
from passlib.context import CryptContext
from app.config.settings import settings

import hashlib

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def _normalize_password(password: str) -> str:
    # Convert to SHA-256 hex (fixed length)
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def hash_password(password):
    normalized = _normalize_password(password)
    return pwd_context.hash(normalized)

def verify_password(password, hashed):
    normalized = _normalize_password(password)
    return pwd_context.verify(normalized, hashed)
def create_token(data: dict):
    return jwt.encode(data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])