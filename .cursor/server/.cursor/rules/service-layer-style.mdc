---
description: Enforces rules to be followed while creating/ updating services.
globs: **/services.py
alwaysApply: false
---
- Use the Ok, Err types from the result library to return valid responses/ user-defined errors from each service method.
- Ensure that input data is always validated. Check for all possible edge cases and return Err instances for invalid edge cases.
- Make use of repository layers for database access in the service layer. Don't access the database directly.
- Define dependencies (other services/ repositories) in the constructor of the service via type annotations. Aioinject will automatically provide the respective dependencies.
