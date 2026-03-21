from app.tools.node_tool_client import load_node_tools
import os

tools = load_node_tools()


def execute_plan(plan):
    result = None
    repo_name = None

    for i, step in enumerate(plan):
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

        # 📁 Map repo path correctly
        if tool_name == "repo_reader" and repo_name:
            if tool_input.startswith("repo/"):
                file_path = tool_input.replace("repo/", "")
                tool_input = f"{repo_name}/{file_path}"

        print(f"\n[EXECUTE] {tool_name} → {tool_input}\n")

        # 🔍 Find tool
        tool = next((t for t in tools if t.name == tool_name), None)
        if not tool:
            print(f"❌ Tool not found: {tool_name}")
            continue

        try:
            # 🚀 Execute safely
            if tool_name == "clone_repo":
                result = tool.run({"url": tool_input})

                if isinstance(result, dict):
                    repo_name = result.get("repo")

                print("📦 Repo:", repo_name)

            elif tool_name == "repo_reader":
                # 🛑 Prevent crash if repo missing
                if not repo_name:
                    print("⚠️ Skipping repo_reader (no repo)")
                    continue

                # 🛑 Check file exists
                full_path = f"node-tools/repos/{tool_input}"
                if not os.path.exists(full_path):
                    print(f"⚠️ File not found: {full_path}")

                    # 🔁 fallback to README
                    fallback = f"{repo_name}/README.md"
                    print(f"➡️ Trying fallback: {fallback}")
                    tool_input = fallback

                result = tool.run({"path": tool_input})

            elif tool_name == "summarize_code":
                result = tool.run({"content": tool_input})

            elif tool_name == "github_search":
                result = tool.run({"query": tool_input})

            else:
                result = tool.run(tool_input)

        except Exception as e:
            print(f"❌ ERROR in {tool_name}: {e}")
            result = {"error": str(e)}

        print("[RESULT]", result)

    return result