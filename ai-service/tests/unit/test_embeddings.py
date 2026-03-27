from app.rag.embedder import get_embeddings

def test_embeddings():
    emb = get_embeddings()
    vec = emb.embed_query("hello world")

    assert isinstance(vec, list)
    assert len(vec) > 0