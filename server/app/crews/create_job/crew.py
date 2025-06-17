import os

from app.config import LLMSettings, SecretSettings, get_settings
from app.crews.filter_job.models import JobOutlineParsed, JobResultData
from crewai import LLM, Agent, Crew, Process, Task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.project import CrewBase, agent, before_kickoff, crew, llm, task
from crewai_tools import SerperDevTool

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators


@CrewBase
class CreateJobCrew:
    """CreateJobCrew crew"""

    agents: list[BaseAgent]
    tasks: list[Task]

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended

    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools

    @before_kickoff
    def prepare_environment(self, inputs):
        print("before kickoff...")
        # Preprocess or modify inputs
        os.environ["SERPER_API_KEY"] = get_settings(
            SecretSettings
        ).serper_api_key.get_secret_value()
        return inputs

    @agent
    def healthcare_research_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["healthcare_research_specialist"],  # type: ignore[index]
            verbose=True,
            tools=[SerperDevTool()],
        )

    @agent
    def job_description_writer(self) -> Agent:
        return Agent(
            config=self.agents_config["job_description_writer"],  # type: ignore[index]
            verbose=True,
        )

    @agent
    def compliance_reviewer(self) -> Agent:
        return Agent(
            config=self.agents_config["compliance_reviewer"],  # type: ignore[index]
            verbose=True,
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def parse_outline_task(self) -> Task:
        return Task(
            config=self.tasks_config["parse_outline_task"],  # type: ignore[index]
            output_pydantic=JobOutlineParsed,
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config["research_task"],  # type: ignore[index]
        )

    @task
    def job_posting_creation_task(self) -> Task:
        return Task(
            config=self.tasks_config["job_posting_creation_task"],  # type: ignore[index]
        )

    @task
    def compliance_review_task(self) -> Task:
        return Task(
            config=self.tasks_config["compliance_review_task"],  # type: ignore[index]
            output_pydantic=JobResultData,
        )

    @task
    def final_output_formatting_task(self) -> Task:
        return Task(
            config=self.tasks_config["final_output_formatting_task"],  # type: ignore[index]
            output_pydantic=JobResultData,
        )

    @llm
    def gemini_llm(self) -> LLM:
        return LLM(
            model=get_settings(LLMSettings).google_gemini_model,
            api_key=get_settings(SecretSettings).google_api_key.get_secret_value(),
            temperature=0.2,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the CreateJobCrew crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            chat_llm=self.gemini_llm(),
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
