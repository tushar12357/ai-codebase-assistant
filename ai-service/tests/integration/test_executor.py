from app.agents.executor_agent import execute_plan

def test_execute_plan_basic():
    plan = [
        {"tool": "clone_repo", "input": "https://github.com/octocat/Hello-World"},
        {"tool": "index_repo", "input": ""},
    ]

    result = execute_plan(plan)

    assert result is not None