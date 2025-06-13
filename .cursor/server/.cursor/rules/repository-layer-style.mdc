---
description: Enforces rules to be followed while creating/ updating repositories.
globs: **/repositories.py
alwaysApply: false
---
- Make use of the Beanie ODM to access the database inside repository methods.
- Don't use `fetch_links=True` in the Beanie methods unless it's necessary to load the relations. It affects database performance.
- Make use of the paginator at [paginator.py](mdc:server/app/database/paginator.py) for repository methods where pagination is required.
- Make sure that the provided IDs (ObjectIds) are type casted properly before being passed to Beanie.
