from app.tools.node_tool_client import fetch_tools


def test_tool_discovery():
    tools = fetch_tools()
    assert isinstance(tools, list)