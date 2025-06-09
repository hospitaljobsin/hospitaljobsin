"""
The main entry point for the agent.

It defines the workflow graph, state, tools, nodes and edges.
"""

from typing import Literal, TypedDict

from copilotkit import CopilotKitState
from langchain.tools import tool
from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode
from langgraph.types import Command, interrupt

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


class NewJobDraft(TypedDict):
    title: str
    job_description: str


class AgentState(CopilotKitState):
    initial_job_outline: str | None
    new_job_draft: NewJobDraft | None
    confirmed: bool


@tool
def get_weather(location: str):
    """
    Get the weather for a given location.
    """
    return f"The weather for {location} is 70 degrees."


# @tool
# def your_tool_here(your_arg: str):
#     """Your tool description here."""
#     print(f"Your tool logic here")
#     return "Your tool response here."

tools = [
    get_weather
    # your_tool_here
]


async def outline_node(state: AgentState, config: RunnableConfig):
    if not state.get("initial_job_outline"):
        return interrupt("Please provide an initial job outline.")
    return Command(goto="draft_node")


async def draft_node(state: AgentState, config: RunnableConfig):
    model = get_chat_model()

    system = SystemMessage(
        content="You are drafting a job based on the user's outline."
    )
    outline = state["initial_job_outline"]
    messages = [
        system,
        *state["messages"],
        AIMessage(content=f"Here's the outline: {outline}. Please draft the job."),
    ]

    response = await model.ainvoke(messages, config)

    # Simulate extracting title + description from response
    draft = {"title": "Software Engineer", "job_description": response.content}

    return Command(
        goto="modify_node", update={"new_job_draft": draft, "messages": [response]}
    )


async def modify_node(state: AgentState, config: RunnableConfig):
    if state.get("confirmed"):
        return Command(goto="create_job_node")

    model = get_chat_model()

    system = SystemMessage(
        content="Here is the current job draft. Ask the user for modifications."
    )
    draft = state["new_job_draft"]
    messages = [
        system,
        *state["messages"],
        AIMessage(content=f"Current draft:\n\n{draft['job_description']}"),
    ]

    response = await model.ainvoke(messages, config)

    return Command(goto="confirm_node", update={"messages": [response]})


async def confirm_node(state: AgentState, config: RunnableConfig):
    # Assume last message contains confirmation intent (yes/no)
    last_msg = state["messages"][-1].content.lower()

    if "yes" in last_msg or "confirm" in last_msg:
        return Command(goto="create_job_node", update={"confirmed": True})
    else:
        return Command(goto="modify_node")


async def create_job_node(state: AgentState, config: RunnableConfig):
    job = state["new_job_draft"]
    print(f"✅ Job created: {job['title']}")
    return Command(
        goto=END, update={"messages": [AIMessage(content="Job created successfully.")]}
    )


async def chat_node(
    state: AgentState, config: RunnableConfig
) -> Command[Literal["tool_node", "__end__"]]:
    """
    Chat node based on the ReAct design pattern.

    It handles:

    - The model to use (and binds in CopilotKit actions and the tools defined above)
    - The system prompt
    - Getting a response from the model
    - Handling tool calls

    For more about the ReAct design pattern, see:
    https://www.perplexity.ai/search/react-agents-NcXLQhreS0WDzpVaS4m9Cg
    """
    # if not state.get("initial_job_outline"):
    #     state["initial_job_outline"] = interrupt(
    #         "Please provide an initial job outline."
    #     )
    # 1. Define the model
    model = get_chat_model()

    # 2. Bind the tools to the model
    model_with_tools = model.bind_tools(
        [
            *state["copilotkit"]["actions"],
            get_weather,
            # your_tool_here
        ],
        # 2.1 Disable parallel tool calls to avoid race conditions,
        #     enable this for faster performance if you want to manage
        #     the complexity of running tool calls in parallel.
        # parallel_tool_calls=False,
    )

    # 3. Define the system message by which the chat model will be run
    system_message = SystemMessage(
        content=f"You are a helpful assistant. Talk in {state.get('language', 'english')}."
    )

    # 4. Run the model to generate a response
    response = await model_with_tools.ainvoke(
        [
            system_message,
            *state["messages"],
        ],
        config,
    )

    # 5. Check for tool calls in the response and handle them. We ignore
    #    CopilotKit actions, as they are handled by CopilotKit.
    if isinstance(response, AIMessage) and response.tool_calls:
        actions = state["copilotkit"]["actions"]

        # 5.1 Check for any non-copilotkit actions in the response and
        #     if there are none, go to the tool node.
        if not any(
            action.get("name") == response.tool_calls[0].get("name")
            for action in actions
        ):
            return Command(goto="tool_node", update={"messages": response})

    # 6. We've handled all tool calls, so we can end the graph.
    return Command(goto=END, update={"messages": response})


# Define the workflow graph
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)
workflow.add_node("tool_node", ToolNode(tools=tools))
workflow.add_edge("tool_node", "chat_node")
workflow.set_entry_point("chat_node")


workflow.add_node("outline_node", outline_node)
workflow.add_node("draft_node", draft_node)
workflow.add_node("modify_node", modify_node)
workflow.add_node("confirm_node", confirm_node)
workflow.add_node("create_job_node", create_job_node)
workflow.add_edge("chat_node", "outline_node")
workflow.add_edge("outline_node", "draft_node")
workflow.add_edge("draft_node", "modify_node")
workflow.add_edge("modify_node", "confirm_node")
workflow.add_edge("confirm_node", "modify_node")  # loop if not confirmed
workflow.add_edge("confirm_node", "create_job_node")
workflow.add_edge("create_job_node", END)

# Compile the workflow graph
graph = workflow.compile(checkpointer=MemorySaver())
