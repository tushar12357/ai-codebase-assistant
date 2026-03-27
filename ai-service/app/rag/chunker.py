from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_docs(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    texts = [d["content"] for d in docs]
    metadatas = [d["metadata"] for d in docs]

    return splitter.create_documents(texts, metadatas=metadatas)