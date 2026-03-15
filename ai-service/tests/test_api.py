from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():

    response = client.get("/")

    assert response.status_code == 200


def test_ask():

    response = client.post(
        "/ask",
        json={"query": "hello"}
    )

    assert response.status_code == 200