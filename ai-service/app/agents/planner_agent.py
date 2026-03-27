from app.core.llm import llm
import json
import re

def extract_json(text):
    try:
        return json.loads(text)
    except:
        match = re.search(r"\[\s*{.*?}\s*\]", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    return []


def create_plan(query: str, history: list = None):
    if history is None:
        history = []

    context = "\n".join(
        [f"{m['role']}: {m['content']}" for m in history]
    )

    prompt = f"""
You are a STRICT AI planning agent.

Return ONLY a VALID JSON ARRAY of steps.

---

Conversation:
{context}

User request:
{query}

---

Available tools:

1. clone_repo(url: string)
2. index_repo(repo_path: string or "")
3. search_repo(query: string)
4. answer_repo(query: string)

---

STRICT RULES (MANDATORY):

- Output MUST be a JSON ARRAY (no text before/after)
- Each step MUST be an OBJECT:
  {{"tool": "...", "input": "..."}}
- DO NOT return strings inside array
- DO NOT wrap JSON in quotes
- DO NOT explain anything

---

PLANNING RULES:

- If GitHub URL present → MUST start with clone_repo
- ALWAYS follow RAG flow:
  clone_repo → index_repo → search_repo → answer_repo
- Keep steps minimal (no unnecessary tools)
- index_repo input can be "" (executor handles repo_path)

---

EXAMPLES:

User: summarize https://github.com/vercel/next.js

[
  {{"tool": "clone_repo", "input": "https://github.com/vercel/next.js"}},
  {{"tool": "index_repo", "input": ""}},
  {{"tool": "search_repo", "input": "project overview"}},
  {{"tool": "answer_repo", "input": "summarize the repository"}}
]

---

User: what does this repo do https://github.com/user/repo

[
  {{"tool": "clone_repo", "input": "https://github.com/user/repo"}},
  {{"tool": "index_repo", "input": ""}},
  {{"tool": "search_repo", "input": "what does this project do"}},
  {{"tool": "answer_repo", "input": "explain the project"}}
]

---

Generate plan now:
"""
    response = llm.invoke(prompt).content
    return extract_json(response)