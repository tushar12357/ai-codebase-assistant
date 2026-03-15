from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.graph.agent_graph import graph

app = FastAPI(
    title="AI Codebase Agent",
    version="1.0.0"
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