# PulseWork API
> *GraphQL API Server Powering PulseWork*


## Tech Stack
- [Python](https://python.org) - Programming Language
- [FastAPI](https://fastapi.tiangolo.com/) - Web framework
- [Pydantic](https://docs.pydantic.dev/) - Data validation library
- [Uvicorn](https://www.uvicorn.org/) - ASGI server
- [Beanie](https://beanie-odm.dev/) - MongoDB ODM
- [Strawberry GraphQL](https://strawberry.rocks/) - GraphQL library
- [Result](https://github.com/rustedpy/result) - Error handling
- [Aioinject](https://github.com/thirvondukr/aioinject) - Async DI library
- [Authlib](https://authlib.org/) - OAuth2 client library
- [Py_WebAuthn](https://duo-labs.github.io/py_webauthn/) - WebAuthn library
- [Structlog](https://www.structlog.org/) - Structured logging
- [MongoDB](https://www.mongodb.com/) - Database

and other packages from [pyproject.toml](./pyproject.toml) 💖

## GraphQL Schema

The generated GraphQL Schema can be read [here](../schema/schema.graphql)

## Setup Guide

### Prerequisites

| Tool                                  | Minimum Tested Version  | Description        |
|---------------------------------------|-------------------------|--------------------|
| [Python](https://python.org)          | 3.12                    | Language           |
| [UV](https://docs.astral.sh/uv/)      | 0.4                     | Package Manager    |

1. Install dependencies
```bash
uv sync -p 3.12 --frozen
```

2. Set Environment variables
Create a `.env` file, referencing the template [here](./.env.example)

## Development commands

### 1. Generate GraphQL Schema
Once you've modified code relevant to the GraphQL schema, you can generate a new schema using the following command:
```bash
uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql
```

### 2. Run server
After following the setup guide, the server can be run independently locally using the following command:
```bash
uv run scripts/run_server.py
```