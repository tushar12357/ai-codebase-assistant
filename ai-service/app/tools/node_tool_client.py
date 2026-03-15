import requests
from pydantic import BaseModel, Field
from langchain_core.tools import StructuredTool
from app.config.settings import settings


class RepoReaderInput(BaseModel):
    path: str = Field(description="Path of file to read in repository")


class SummarizeCodeInput(BaseModel):
    content: str = Field(description="Code content to summarize")


class GithubSearchInput(BaseModel):
    query: str = Field(description="Search query for GitHub repositories")

class CloneRepoInput(BaseModel):
    url: str = Field(description="GitHub repository URL")

def fetch_tools():
    res = requests.get(f"{settings.NODE_TOOL_SERVER}/tools")
    res.raise_for_status()
    return res.json()


def call_tool(name, payload):
    res = requests.post(
        f"{settings.NODE_TOOL_SERVER}/tool/{name}",
        json=payload
    )
    res.raise_for_status()
    return res.json()


def repo_reader(path: str):
    return call_tool("repo_reader", {"path": path})


def summarize_code(content: str):
    return call_tool("summarize_code", {"content": content})


def github_search(query: str):
    return call_tool("github_search", {"query": query})

def clone_repo(url: str):
    return call_tool("clone_repo", {"url": url})

TOOL_REGISTRY = {
    "repo_reader": {
        "func": repo_reader,
        "description": "Read a file from the repository",
        "args_schema": RepoReaderInput,
    },
    "summarize_code": {
        "func": summarize_code,
        "description": "Summarize a block of code",
        "args_schema": SummarizeCodeInput,
    },
    "github_search": {
        "func": github_search,
        "description": "Search GitHub repositories",
        "args_schema": GithubSearchInput,
    },
    "clone_repo": {
    "func": clone_repo,
    "description": "Clone a GitHub repository",
    "args_schema": CloneRepoInput,
},
}


def load_node_tools():
    tools = []
    discovered = fetch_tools()

    for t in discovered:
        name = t["name"]
        if name in TOOL_REGISTRY:
            entry = TOOL_REGISTRY[name]
            tools.append(
                StructuredTool.from_function(
                    name=name,
                    description=entry["description"],
                    func=entry["func"],
                    args_schema=entry["args_schema"],
                )
            )
        else:
            print(f"[WARN] Discovered tool '{name}' has no local binding, skipping")

    return tools