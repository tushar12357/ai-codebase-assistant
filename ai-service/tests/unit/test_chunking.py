from app.rag.chunker import chunk_docs

def test_chunk_docs():
    docs = [{"content": "print('hello')" * 100, "metadata": {}}]
    chunks = chunk_docs(docs)

    assert len(chunks) > 1