---
description: Enforces rules to follow when creating/ updating GraphQL fields that can be queried.
globs: **/query.py,**/types.py
alwaysApply: false
---
- Rely on Strawberry GraphQL for creating the GraphQL query fields in Python.
- Make use of service or repository layers to fetch data inside fields. Don't access the database/ any other service directly.
- Access services/ repositories via aioinject.
- Make use of dataloaders to access data wherever relevant to avoid N+1 queries. The dataloaders are stored in the `info.context["loaders"]` field.
- Ensure relevant permissions are added to the created fields (like IsAuthenticated(), RequiresSudoMode())
- Use the Python match statement to handle all the results returned by services. Ensure that you call assert_never on the default case to satisfy type checkers.
example:
```py
from typing import assert_never

case _ as unreachable:
    assert_never(unreachable)
```
- Ensure all arguments for the field have proper descriptions.
- When @strawberry.input classes are passed as arguments, make sure to call the `to_document()` method on them to convert them into Beanie documents.
- While returning values, you can call `GraphQLTypeClass.marshal(value)` to transform the value from a service/reposiory into a valid GraphQL type.
- When multiple results are possible (as a result of all edge cases), make sure to create a Strawberry GraphQL union as the return type for the field, that encompasses all the cases' return types.
- For fields where pagination is required, make sure to use Connection GraphQL return types. The repository layer returns `PaginatedResult` instances which can easily be converted into connections
  by calling the `Connection.marshal(paginated_result)` method.
- Make use of the `Info` annotation when accessing the strawberry.info data in an anonymous field. Make use of the `AuthInfo` annotation when accessing the same in an authenticated field.
