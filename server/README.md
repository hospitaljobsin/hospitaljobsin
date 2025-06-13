# Hospital Jobs API
> *GraphQL API Server Powering Hospital Jobs*

## Tech Stack
- [Python](https://python.org) - Programming Language
- [FastAPI](https://fastapi.tiangolo.com/) - Web Framework
- [Pydantic](https://docs.pydantic.dev/) - Data Validation Library
- [Uvicorn](https://www.uvicorn.org/) - ASGI Server
- [Beanie](https://beanie-odm.dev/) - MongoDB ODM
- [Strawberry GraphQL](https://strawberry.rocks/) - GraphQL Library
- [Result](https://github.com/rustedpy/result) - Error handling
- [Aioinject](https://github.com/thirvondukr/aioinject) - Async DI Library
- [Authlib](https://authlib.org/) - OAuth2 client Library
- [PyWebAuthn](https://duo-labs.github.io/py_webauthn/) - WebAuthn Library
- [Structlog](https://www.structlog.org/) - Structured logging
- [MongoDB](https://www.mongodb.com/) - Database
- [CrewAI](https://crewai.com/) - Agentic Framework

and other packages from [pyproject.toml](./pyproject.toml) 💖

## GraphQL Schema

The generated GraphQL Schema can be read [here](../schema/schema.graphql)

## Setup Guide

### Prerequisites

| Tool                                  | Minimum Tested Version  | Description        |
|---------------------------------------|-------------------------|--------------------|
| [Python](https://python.org)          | 3.12                    | Language           |
| [UV](https://docs.astral.sh/uv/)      | 0.4                     | Package Manager    |

#### 1. Install dependencies
```bash
uv sync -p 3.12 --frozen
```

#### 2. Setup Google Oauth2 Client

- [Go to the google cloud console](https://console.cloud.google.com/)
- Create/ select a new project
- Configure the Oauth consent screen
- Go to "APIs & Services" > "Credentials", and create new Oauth 2.0 Credentials
- While creating the credentials, fill in the following information:
	- **Client config:**
		- *Authorized Javascript origins:*
			- https://accounts.localtest.me
		- *Authorized Redirect URIs:*
			- https://api.localtest.me/auth/callback/signin/google
			- https://api.localtest.me/auth/callback/request_sudo_mode/google

	- **Project Branding config:**
		- *App name:* Hospital Jobs Dev
		- *App Domain:*
			- *Application home page:* https://localtest.me
			- *Application privacy policy link:* https://localtest.me/privacy
			- *Application terms of service link:* https://localtest.me/terms
		- *Authorized domains:*
			- localtest.me


#### 3. Set Environment variables
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
