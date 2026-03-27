

def test_chat():
    res = client.post(
        "/chat/test/ask",
        json={"query": "summarize https://github.com/octocat/Hello-World"}
    )

    assert res.status_code == 200
    assert "result" in res.json()