from app.tools.repo_tools import clone_repo
from app.rag.loader import load_repo
from app.rag.chunker import chunk_docs
from app.rag.embedder import get_embeddings
from app.rag.vectorstore import create_vectorstore, load_vectorstore
from app.rag.retriever import retrieve_docs
from app.rag.qa import answer_query
import os

embeddings = get_embeddings()

def execute_plan(plan):
    repo_path = None
    repo_name = None
    db = None
    result = None

    for step in plan:
        tool = step.get("tool")
        inp = step.get("input")

        print(f"\n[EXECUTE] {tool} → {inp}")

        if tool == "clone_repo":
            repo_path = clone_repo(inp)
            repo_name = repo_path.split("/")[-1]

        elif tool == "index_repo":
            db_path = f"vectorstores/{repo_name}"

            if os.path.exists(db_path):
                print("⚡ Using existing vector DB")
                db = load_vectorstore(repo_name, embeddings)
            else:
                print("📦 Indexing repo...")
                docs = load_repo(repo_path)
                chunks = chunk_docs(docs)
                db = create_vectorstore(chunks, embeddings, repo_name)

            result = "indexed"

        elif tool == "search_repo":
            if db is None:
                db = load_vectorstore(repo_name, embeddings)

            docs = retrieve_docs(db, inp)
            result = docs

        elif tool == "answer_repo":
            result = answer_query(inp, result)

        print("[RESULT]", result)

    return result