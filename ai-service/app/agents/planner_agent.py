from langchain_groq import ChatGroq
import json
import re

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)


def extract_json(text: str):
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        return match.group(0)
    return None


def create_plan(query: str):

    prompt = f"""
You are an AI planning agent.

User request:
{query}

Available tools:

github_search(query) → search GitHub repositories
clone_repo(url) → clone a GitHub repository locally
repo_reader(path) → read a file from the cloned repository
summarize_code(content) → summarize code

Rules:

1. If the user provides a GitHub URL → use clone_repo first.
2. repo_reader ONLY reads files from a cloned repository.
3. If the user asks to summarize a file from a repo:
   clone_repo → repo_reader → summarize_code
4. summarize_code MUST run after repo_reader.
5. NEVER pass a GitHub URL to repo_reader.

Return ONLY JSON.

Example:

User: summarize package.json from https://github.com/user/repo

[
  {{"tool":"clone_repo","input":"https://github.com/user/repo"}},
  {{"tool":"repo_reader","input":"repo/package.json"}},
  {{"tool":"summarize_code","input":"<previous>"}}
]
"""
    response = llm.invoke(prompt).content

    json_text = extract_json(response)

    if not json_text:
        return []

    try:
        return json.loads(json_text)
    except:
        return []