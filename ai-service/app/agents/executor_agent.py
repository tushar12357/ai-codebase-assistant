from app.tools.node_tool_client import load_node_tools
import re

tools = load_node_tools()

def is_url(value):
    return isinstance(value, str) and value.startswith("http")



def execute_plan(plan):

    result = None
    repo_name = None

    for step in plan:

        tool_name = step["tool"]
        tool_input = step["input"]

        if tool_input == "<previous>":
            if isinstance(result, dict) and "content" in result:
                tool_input = result["content"]
            else:
                tool_input = result

        for tool in tools:
            if tool.name == tool_name:

                result = tool.run(tool_input)

                # capture repo name after clone
                if tool_name == "clone_repo":
                    repo_name = result.get("repo")

    return result