from app.tools.node_tool_client import load_node_tools 
import os 

tools = load_node_tools() 

def execute_plan(plan):
    result = None
    repo_name = None

    for step in plan:
        tool_name = step["tool"]
        tool_input = step["input"]

        # 🔁 Resolve <previous>
        if tool_input == "<previous>":
            if isinstance(result, dict):
                tool_input = (
                    result.get("content")
                    or result.get("data")
                    or str(result)
                )
            else:
                tool_input = result

        print(f"\n[EXECUTE] {tool_name} → {tool_input}\n")

        # 🔍 Find tool
        tool = next((t for t in tools if t.name == tool_name), None)
        if not tool:
            print(f"❌ Tool not found: {tool_name}")
            continue

        try:
            if tool_name == "clone_repo":
                result = tool.run({"url": tool_input})
                if isinstance(result, dict):
                    repo_name = result.get("repo")
                    print("📦 Repo:", repo_name)

            elif tool_name == "repo_reader":
                if not repo_name:
                    print("⚠️ Skipping repo_reader (no repo)")
                    continue

                # 🧠 Normalize path
                clean_input = tool_input.replace("\\", "/")

                # Case 1: already full path → use as is
                if f"repos/{repo_name}/" in clean_input:
                     full_path = clean_input

                # Case 2: starts with repos/ but missing repo_name
                elif clean_input.startswith("repos/"):
                    file_path = clean_input.replace("repos/", "")
                    full_path = f"repos/{repo_name}/{file_path}"

                # Case 3: raw file like "package.json"
                else:
                    full_path = f"repos/{repo_name}/{clean_input}"

                print(f"📂 Resolved path → {full_path}")

                result = tool.run({"path": full_path})
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