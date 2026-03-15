from langgraph.graph import StateGraph
from typing import TypedDict
from app.agents.planner_agent import create_plan
from app.agents.executor_agent import execute_plan


class AgentState(TypedDict):
    query: str
    plan: list
    result: str


def planner_node(state: AgentState):

    plan = create_plan(state["query"])

    return {"plan": plan}


def executor_node(state: AgentState):

    result = execute_plan(state["plan"])

    return {"result": result}


def build_graph():

    graph = StateGraph(AgentState)

    graph.add_node("planner", planner_node)
    graph.add_node("executor", executor_node)

    graph.set_entry_point("planner")

    graph.add_edge("planner", "executor")

    graph.set_finish_point("executor")

    return graph.compile()


graph = build_graph()