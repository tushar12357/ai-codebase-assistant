from langchain_groq import ChatGroq
import json
import re

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)


# 🔍 Extract JSON safely
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


# 🧠 Planner
def create_plan(query: str, history: list = None):
    if history is None:
        history = []

    context = "\n".join(
        [f"{m['role']}: {m['content']}" for m in history]
    )

    prompt = f"""
You are a STRICT AI planning agent.

Your job is to convert a user request into a VALID JSON tool execution plan.

You MUST follow the rules exactly.

---

Conversation:
{context}

User request:
{query}

---

Available tools:

1. github_search(query)
   - Use this to search for repositories by topic
   - Returns a LIST of repositories
   - This is a FINAL step (no further tools after this)

2. clone_repo(url)
   - Use ONLY when a direct GitHub URL is provided

3. repo_reader(path)
   - Reads a file from a cloned repository
   - MUST ONLY use paths starting with "repo/"

4. summarize_code(content)
   - Summarizes code
   - MUST ONLY be used AFTER repo_reader

---

STRICT RULES (DO NOT BREAK):

1. If user provides a DIRECT GitHub URL → ALWAYS use clone_repo FIRST
2. If user asks to "search", "find", "best", or gives a topic (e.g. "langchain repos") → use github_search ONLY
3. github_search MUST NOT be followed by clone_repo
4. github_search is ALWAYS the FINAL step
5. NEVER pass a GitHub URL to repo_reader
6. repo_reader MUST ONLY use paths starting with "repo/"
7. NEVER use actual repo names like "payment_gateway/"
8. If file is not specified → use "repo/package.json"
9. summarize_code MUST ALWAYS come AFTER repo_reader
10. NEVER skip steps
11. ALWAYS return a JSON ARRAY
12. NO explanation, NO markdown, ONLY JSON

---

VALID EXAMPLES:

Example 1:
User: find best langchain repositories

[
  {{"tool":"github_search","input":"langchain"}}
]

Example 2:
User: search react projects

[
  {{"tool":"github_search","input":"react"}}
]

Example 3:
User: https://github.com/vercel/next.js

[
  {{"tool":"clone_repo","input":"https://github.com/vercel/next.js"}},
  {{"tool":"repo_reader","input":"repo/package.json"}},
  {{"tool":"summarize_code","input":"<previous>"}}
]

Example 4:
User: summarize package.json from https://github.com/user/repo

[
  {{"tool":"clone_repo","input":"https://github.com/user/repo"}},
  {{"tool":"repo_reader","input":"repo/package.json"}},
  {{"tool":"summarize_code","input":"<previous>"}}
]

---

Now generate the plan:
"""
    

    response = llm.invoke(prompt).content

    print("\n🧠 RAW LLM OUTPUT:\n", response)  # debug

    plan = extract_json(response)

    # 🛡️ Safety fallback (VERY IMPORTANT)
    if not isinstance(plan, list) or len(plan) == 0:
        print("⚠️ Invalid plan, using fallback")

        if "github.com" in query:
            return [
                {"tool": "clone_repo", "input": query},
                {"tool": "repo_reader", "input": "repo/package.json"},
                {"tool": "summarize_code", "input": "<previous>"},
            ]

        return []

    # 🛠️ Normalize plan (anti-hallucination layer)
    fixed_plan = []

    for step in plan:
        tool = step.get("tool")
        inp = step.get("input")

        if not tool or inp is None:
            continue

        # 🚫 Fix bad repo paths
        if tool == "repo_reader":
            if not str(inp).startswith("repo/"):
                inp = "repo/package.json"

        # 🚫 Prevent URL misuse
        if tool == "repo_reader" and "github.com" in str(inp):
            inp = "repo/package.json"

        fixed_plan.append({
            "tool": tool,
            "input": inp
        })

    return fixed_plan