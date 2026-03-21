from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.graph.agent_graph import graph

app = FastAPI(
    title="AI Codebase Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/ask")
def ask(payload: dict):

    query = payload.get("query")

    result = graph.invoke({
        "query": query
    })

    return {
        "answer": result["result"]
    }