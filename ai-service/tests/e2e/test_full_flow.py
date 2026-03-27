

def test_full_rag_flow():
    res1 = client.post(
        "/chat/test/ask",
        json={"query": "summarize https://github.com/octocat/Hello-World"}
    )

    assert res1.status_code == 200

    res2 = client.post(
        "/chat/test/ask",
        json={"query": "what does this repo do?"}
    )

    assert res2.status_code == 200
    assert res2.json()["result"] is not None