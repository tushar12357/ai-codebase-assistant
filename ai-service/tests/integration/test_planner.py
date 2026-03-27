from app.agents.planner_agent import create_plan

def test_create_plan():
    query = "summarize https://github.com/octocat/Hello-World"
    plan = create_plan(query)

    assert isinstance(plan, list)
    assert plan[0]["tool"] == "clone_repo"