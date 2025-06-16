#!/usr/bin/env python3
import sys
import warnings
from typing import Dict, List
from app.accounts.repositories import ProfileRepo
from .crew import FilterJobCrew, ProfileMatch

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


async def run(query: str, profile_repo: ProfileRepo) -> List[ProfileMatch]:
    """
    Run the filter job crew with the given query.

    Args:
        query: Natural language query describing job requirements
        profile_repo: ProfileRepo instance for database operations

    Returns:
        List of matched profiles with scores and reasons
    """
    crew = FilterJobCrew(profile_repo)
    return await crew.run(query)


async def train(profile_repo: ProfileRepo) -> None:
    """
    Train the filter job crew.

    Args:
        profile_repo: ProfileRepo instance for database operations
    """
    crew = FilterJobCrew(profile_repo)
    # Add training logic here
    pass


async def replay(task_id: str, profile_repo: ProfileRepo) -> None:
    """
    Replay crew execution from a specific task.

    Args:
        task_id: ID of the task to replay from
        profile_repo: ProfileRepo instance for database operations
    """
    crew = FilterJobCrew(profile_repo)
    # Add replay logic here
    pass


async def test(profile_repo: ProfileRepo) -> None:
    """
    Test the filter job crew.

    Args:
        profile_repo: ProfileRepo instance for database operations
    """
    crew = FilterJobCrew(profile_repo)
    # Add test logic here
    pass


if __name__ == "__main__":
    import asyncio

    if len(sys.argv) < 2:
        print("Usage: python main.py <query>")
        sys.exit(1)

    async def main():
        query = sys.argv[1]
        profile_repo = ProfileRepo()

        try:
            results = await run(query, profile_repo)
            print("\nMatched Profiles:")
            for match in results:
                print(f"\nProfile ID: {match.profile_id}")
                print(f"Score: {match.score}")
                print("Match reasons:")
                for reason in match.match_reasons:
                    print(f"- {reason}")
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)

    asyncio.run(main())
