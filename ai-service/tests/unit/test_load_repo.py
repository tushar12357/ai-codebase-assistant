import os
from app.tools.repo_tools import clone_repo

def test_clone_repo():
    url = "https://github.com/octocat/Hello-World"
    path = clone_repo(url)

    assert os.path.exists(path)
    assert "Hello-World" in path