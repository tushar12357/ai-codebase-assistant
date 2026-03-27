from app.tools.repo_tools import list_files

def load_repo(repo_path: str):
    docs = []

    for file in list_files(repo_path):
        try:
            with open(file, "r", encoding="utf-8") as f:
                docs.append({
                    "content": f.read(),
                    "metadata": {"source": file}
                })
        except:
            continue

    return docs