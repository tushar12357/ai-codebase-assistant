from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Chat, Message
from app.auth.deps import get_current_user, get_db
from app.chat.service import get_messages, save_message
from app.graph.agent_graph import graph

router = APIRouter(prefix="/chat", tags=["chat"])

# ✅ CREATE CHAT
@router.post("/create")
def create_chat(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    chat = Chat(user_id=user.id)
    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {"chat_id": chat.id}


# ✅ LIST CHATS
@router.get("")
def list_chats(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    chats = db.query(Chat).filter(Chat.user_id == user.id).all()

    return [
        {
            "id": c.id,
            "created_at": c.created_at
        }
        for c in chats
    ]


# ✅ GET MESSAGES
@router.get("/{chat_id}/messages")
def get_chat_messages(
    chat_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user.id).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = db.query(Message).filter(Message.chat_id == chat_id).all()

    return [
        {
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at
        }
        for m in messages
    ]


# ✅ ASK (moved under /chat)
@router.post("/{chat_id}/ask")
def ask(
    chat_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    query = payload.get("query")

    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = get_messages(db, chat_id)
    messages.append({"role": "user", "content": query})

    result = graph.invoke({
        "messages": messages
    })

    save_message(db, chat_id, "user", query)
    save_message(db, chat_id, "assistant", str(result["result"]))

    return {"answer": result["result"]}