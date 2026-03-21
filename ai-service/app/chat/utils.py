from langchain_groq import ChatGroq

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

def generate_title(query: str):
    prompt = f"""
    Generate a short 3-5 word title for this request:
    "{query}"

    Only return title, nothing else.
    """

    try:
        return llm.invoke(prompt).content.strip().replace('"', '')
    except:
        return "New Chat"