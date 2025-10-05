# Hospital Jobs Development Guide

## Do

- Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.
- Use Relay GraphQL client for data fetching
- Use Suspense with appropriate skeletons over components that fetch data
- Declare fragments for each sub component that needs to read data.
- Use HeroUI v2 components for the frontend, along with tailwindcss v4. Ensure your code is v4 compatible
- Use React Hook Form whenever building forms
- Use XState whenever state machines are required (ex: multi-step forms)
- Always use functional React components
- Use next/dynamic imports for components that are strictly client side (only "use client" directive usage pre-renders it on the server)
- Use zod/v4 for input validation in the frontend.

## Don't

- Don't edit the GraphQL schema in schema/schema.graphql manually. Its a generated file, from the python GraphQL code.
- Don't use class components in React
- Don't hardcode colors. Always follow our HeroUI theme

## Commands

### Regenerate GraphQL Schema

After making changes to the GraphQL schema in the backend, run:

```bash
cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql
```

## Project Structure

- Backend is in server/ directory
- Frontends are separate. They are in apps/ directory
  - Under each frontend app, the components are in the components/ directory
- E2E tests are in e2e/ directory
