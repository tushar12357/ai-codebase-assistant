



def test_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"