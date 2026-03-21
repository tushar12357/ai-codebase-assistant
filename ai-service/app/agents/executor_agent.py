from app.tools.node_tool_client import load_node_tools

tools = load_node_tools()


def execute_plan(plan):

    result = None
    repo_name = None

    for step in plan:

        tool_name = step["tool"]
        tool_input = step["input"]

        # 🔁 Handle <previous>
        if tool_input == "<previous>":
            if isinstance(result, dict):
                tool_input = (
                    result.get("content")
                    or result.get("data")
                    or str(result)
                )
            else:
                tool_input = result

        # 📁 Fix repo path mapping
        if tool_name == "repo_reader" and isinstance(tool_input, str):
            if tool_input.startswith("repo/") and repo_name:
                file_path = tool_input.replace("repo/", "")
                tool_input = f"{repo_name}/{file_path}"

        # 🔍 Debug (very useful)
        print(f"\n[EXECUTE] {tool_name} → {tool_input}\n")

        for tool in tools:
            if tool.name == tool_name:

                # ✅ FIX: Proper payload for StructuredTool
                if tool_name == "clone_repo":
                    result = tool.run({"url": tool_input})

                elif tool_name == "repo_reader":
                    result = tool.run({"path": tool_input})

                elif tool_name == "summarize_code":
                    result = tool.run({"content": tool_input})

                elif tool_name == "github_search":
                    result = tool.run({"query": tool_input})

                else:
                    result = tool.run(tool_input)

                # 📦 Capture repo name
                if tool_name == "clone_repo" and isinstance(result, dict):
                    repo_name = result.get("repo")

        print("[RESULT]", result)

    return result