"""
The main entry point for the agent.

It defines the workflow graph, state, tools, nodes and edges.
"""

from typing import Literal

from copilotkit import CopilotKitState
from copilotkit.langchain import copilotkit_exit
from langchain_core.runnables import RunnableConfig
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph
from langgraph.types import interrupt

from app.config import SecretSettings, get_settings

# TODO: we need separate nodes for actions.
# create_job, update_job cannot be defined as tools, as they require human intervention and multiple steps inbetween.

# here is an example list of nodes we need for creating a job:
# workflow.add_node("chat_node", chat_node)
# workflow.add_node("outline_node", outline_node)
# workflow.add_node("draft_node", draft_node)
# workflow.add_node("modify_node", modify_node)
# workflow.add_node("confirm_node", confirm_node)
# workflow.add_node("create_job_node", create_job_node)

# workflow.set_entry_point("chat_node")

# workflow.add_edge("chat_node", "outline_node")
# workflow.add_edge("outline_node", "draft_node")
# workflow.add_edge("draft_node", "modify_node")
# workflow.add_edge("modify_node", "confirm_node")
# workflow.add_edge("confirm_node", "modify_node")  # loop if not confirmed
# workflow.add_edge("confirm_node", "create_job_node")
# workflow.add_edge("create_job_node", END)

# TODO: now, we need to figure out how to route intelligently to the right node based on the user's intent.

# TODO: we need separate langgraph "agents" for the separate assistants on each page
# ex: one for the dashboard page -> which handles job creation, data crunching etc
# ex: one for the job detail page
# ex: one for the job applicants view page
# ex: one for the job applicant detail page

# In the frontend, we will lock to a particular agent by passing in the agent name like this:
# <CopilotKit runtimeUrl="<copilot-runtime-url>" agent="<the-name-of-the-agent>">
#   {/* Your application components */}
# </CopilotKit>

# TODO: we need separate agents for separate tasks. this way we can divide context into smaller chunks
# https://docs.copilotkit.ai/coagents/multi-agent-flows

# TODO: but I think a separate agent for EACH task is overkill, as we will have a lot of agents.
# we need to utlize subgraphs instead. Each subgraph has its own state and can be used to handle a specific task.
# refer https://langchain-ai.github.io/langgraph/concepts/subgraphs/

# therefore, we will have one separate agent for creating a new job, one for updating an existing job, etc

# TODO: we also need to maintain separate "threads" for each page, and switch between them dynamically.
# the thread IDs should ideally be stored in the backend.

# threads are completely independent of agents, no need to confuse between the two.


def get_chat_model() -> ChatGoogleGenerativeAI:
    """Get the chat model to use for the agent."""
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=get_settings(SecretSettings).google_api_key.get_secret_value(),
    )


# Shared state schema


class State(CopilotKitState):
    draft: str | None
    user_feedback: Literal["accept", "modify"] | None
    initial_outline: str | None


async def get_job_outline_from_messages(state: State) -> str | None:
    """Extract job outline from messages (the initial user prompt)."""
    # won't it be enough to extract the outline with the most recent user message?
    return None


# Define nodes


async def generate_initial_outline(state: State) -> State:
    initial_outline = state.get("initial_outline")
    if initial_outline is None:
        initial_outline = await get_job_outline_from_messages(state)
    state["initial_outline"] = initial_outline
    return state


async def generate_initial_draft(state: State) -> State:
    initial_outline = state.get("initial_outline")
    if initial_outline is None:
        # TODO: instead of an interrupt here, it would be better if we emitted a message to the user,
        # and then tried to extract the outline from the user input again (using get_job_outline_from_messages).
        extracted_outline = interrupt(
            "Please provide a job outline to generate the draft."
        )
        state["initial_outline"] = extracted_outline
    print("Generating initial draft...")
    # TODO: Use the chat model to generate a draft based on the initial outline
    state["draft"] = "This is a first draft."
    return state


def get_user_feedback(state: State) -> State:
    print("Requesting user feedback...")
    user_feedback = None
    while user_feedback not in ["accept", "modify"]:
        user_feedback = interrupt(
            "Please review the draft and provide feedback: "
            f"{state['draft']}\nType 'accept' to save or 'modify' to change."
        )
    print(f"User feedback received: {user_feedback}")
    state["user_feedback"] = user_feedback  # or "modify"
    return state


async def save_draft(state: State, config: RunnableConfig) -> State:
    print(f"Saving draft: {state['draft']}")
    await copilotkit_exit(config)
    return state


async def modify_draft(state: State) -> State:
    user_modifications = interrupt("Please enter your modifications to the draft: ")
    print(f"Modifying draft: {state['draft']}")
    # reset state for next iteration
    state["draft"] = "New modified draft."
    return state


# Build the graph
workflow = StateGraph(State)

workflow.add_node("generate_initial_outline", generate_initial_outline)
workflow.add_node("generate_draft", generate_initial_draft)
workflow.add_node("get_user_feedback", get_user_feedback)
workflow.add_node("save_draft", save_draft)
workflow.add_node("modify_draft", modify_draft)

workflow.set_entry_point("generate_initial_outline")

# Conditional transition based on feedback
workflow.add_conditional_edges(
    "get_user_feedback",
    lambda state: state["user_feedback"],
    {
        "accept": "save_draft",
        "modify": "modify_draft",
    },
)

workflow.add_edge("save_draft", END)

workflow.add_edge("generate_initial_outline", "generate_draft")

# Transition from draft to feedback
workflow.add_edge("generate_draft", "get_user_feedback")
workflow.add_edge("modify_draft", "get_user_feedback")

# Compile the graph
graph = workflow.compile()
