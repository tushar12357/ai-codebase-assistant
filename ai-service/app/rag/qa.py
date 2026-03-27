from app.core.llm import llm

def answer_query(query, docs):
    context = "\n\n".join([d.page_content for d in docs])

    prompt = f"""
You are a senior engineer.

Answer based on the repository context:

{context}

Question: {query}

Give clear and concise answer.
"""

    return llm.invoke(prompt).content