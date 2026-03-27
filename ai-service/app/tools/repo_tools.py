import os
import subprocess

BASE_DIR = "repos"

def clone_repo(url: str):
    repo_name = url.split("/")[-1].replace(".git", "")
    repo_path = os.path.join(BASE_DIR, repo_name)

    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    if not os.path.exists(repo_path):
        subprocess.run(
            ["git", "clone", "--depth", "1", url, repo_path],
            check=True
        )

    return repo_path


def list_files(repo_path: str):
    files = []
    for root, _, filenames in os.walk(repo_path):
        for f in filenames:
            if f.endswith((".py", ".js", ".ts", ".md", ".json")):
                files.append(os.path.join(root, f))
    return files