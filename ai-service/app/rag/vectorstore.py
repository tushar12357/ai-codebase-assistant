from langchain_community.vectorstores import FAISS
import os

BASE_DB = "vectorstores"

def get_db_path(repo_name):
    return os.path.join(BASE_DB, repo_name)


def create_vectorstore(docs, embeddings, repo_name):
    db = FAISS.from_documents(docs, embeddings)

    path = get_db_path(repo_name)
    db.save_local(path)

    return db


def load_vectorstore(repo_name, embeddings):
    path = get_db_path(repo_name)

    return FAISS.load_local(
        path,
        embeddings,
        allow_dangerous_deserialization=True
    )