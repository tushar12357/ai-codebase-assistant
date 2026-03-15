from app.agents.code_agent import run_agent


def test_agent_runs():
    result = run_agent("hello")
    assert result is not None