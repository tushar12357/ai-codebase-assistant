from sqlalchemy.orm import Session
from app.db.models import Message

def get_messages(db: Session, chat_id: str):
    msgs = db.query(Message).filter(Message.chat_id == chat_id).all()
    return [{"role": m.role, "content": m.content} for m in msgs]

def save_message(db: Session, chat_id, role, content):
    msg = Message(chat_id=chat_id, role=role, content=content)
    db.add(msg)
    db.commit()