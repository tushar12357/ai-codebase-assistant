from app.agents.planner_agent import create_plan
from app.agents.executor_agent import execute_plan

def run_agent(query: str):

    plan = create_plan(query)

    print("Generated Plan:", plan)

    if not plan:
        return "Planner failed."

    result = execute_plan(plan)

    return result