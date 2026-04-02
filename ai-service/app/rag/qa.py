from app.core.llm import llm

def answer_query(query, docs):
    if not docs:
        context = "No relevant context found in the repository."
    else:
        context = "\n\n".join([d.page_content for d in docs if d])

    prompt = f"""
You are a senior engineer.

Answer based on the repository context:

{context}

Question: {query}

Give clear and concise answer.
"""

    return llm.invoke(prompt).content