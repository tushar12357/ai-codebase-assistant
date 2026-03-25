from langchain_groq import ChatGroq
import json
import re

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)

def extract_json(text: str):
    try:
        return json.loads(text)
    except:
        match = re.search(r"\[\s*{.*?}\s*\]", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except:
                return []
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
1. github_search(query)
2. clone_repo(url)
3. repo_reader(path)
4. summarize_code(content)

--- INTENT RULES (VERY IMPORTANT):
1. If user gives ONLY a GitHub URL:
   → ONLY use clone_repo

2. If user asks to summarize repo:
   → clone_repo → repo_reader → summarize_code

3. If user asks to read a file:
   → clone_repo → repo_reader

4. If user asks to search:
   → github_search ONLY (FINAL STEP)

--- STRICT RULES:
- NEVER chain tools unless needed
- NEVER assume user wants summary
- repo_reader path MUST start with "repos/"
- default file = repos/README.md (NOT package.json)
- ALWAYS return JSON ARRAY
- NO explanation

--- Examples:

User: https://github.com/vercel/next.js
[
  {{"tool":"clone_repo","input":"https://github.com/vercel/next.js"}}
]

User: summarize https://github.com/vercel/next.js
[
  {{"tool":"clone_repo","input":"https://github.com/vercel/next.js"}},
  {{"tool":"repo_reader","input":"repos/README.md"}},
  {{"tool":"summarize_code","input":"<previous>"}}
]

User: read package.json from https://github.com/user/repo
[
  {{"tool":"clone_repo","input":"https://github.com/user/repo"}},
  {{"tool":"repo_reader","input":"repos/package.json"}}
]

User: best langchain repos
[
  {{"tool":"github_search","input":"langchain"}}
]

--- Generate plan:
"""

    response = llm.invoke(prompt).content
    print("\n🧠 RAW LLM OUTPUT:\n", response)

    plan = extract_json(response)

    # 🔒 Fallback
    if not isinstance(plan, list) or len(plan) == 0:
        if "github.com" in query:
            return [{"tool": "clone_repo", "input": query}]
        return []

    # 🛡️ Normalize
    fixed_plan = []
    for step in plan:
        tool = step.get("tool")
        inp = step.get("input")

        if not tool or inp is None:
            continue

        if tool == "repo_reader":
            if not str(inp).startswith("repos/"):
                inp = "repos/README.md"
            if "github.com" in str(inp):
                inp = "repos/README.md"

        fixed_plan.append({
            "tool": tool,
            "input": inp
        })

    return fixed_plan