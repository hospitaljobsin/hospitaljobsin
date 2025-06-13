---
description: Enforces rules to follow when creating/ updating GraphQL mutations.
globs: **/mutation.py
alwaysApply: false
---
- Rely on Strawberry GraphQL for creating the GraphQL mutations in Python.
- Make use of service or repository layers to perform actions inside mutations. Don't access the database/ any other service directly.
- Access services/ repositories via aioinject.
- Ensure relevant permissions are added to the created mutations (like IsAuthenticated(), RequiresSudoMode())
- Use the Python match statement to handle all the results returned by services. Ensure that you call assert_never on the default case to satisfy type checkers.
example:
```py
from typing import assert_never

case _ as unreachable:
    assert_never(unreachable)
```
- Ensure all arguments for the mutation have proper descriptions.
- When @strawberry.input classes are passed as arguments, make sure to call the `to_document()` method on them to convert them into Beanie documents.
- When multiple results are possible (as a result of all edge cases), make sure to create a Strawberry GraphQL union as the return type for the mutation, that encompasses all the cases' return types.
