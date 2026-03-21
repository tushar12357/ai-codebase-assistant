from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User
from app.auth.auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(payload: dict, db: Session = Depends(get_db)):
    user = User(
        email=payload["email"],
        password=hash_password(payload["password"])
    )
    db.add(user)
    db.commit()
    return {"message": "created"}

@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload["email"]).first()

    if not user or not verify_password(payload["password"], user.password):
        raise HTTPException(status_code=401)

    token = create_token({"user_id": user.id})
    return {"token": token}