FROM node:22 AS base
WORKDIR /app
RUN corepack enable
COPY ./apps/accounts/package.json ./apps/accounts/pnpm-lock.yaml ./apps/accounts/
COPY ./schema/ ./schema/

WORKDIR /app/apps/accounts

RUN pnpm install

COPY ./apps/accounts/ ./

RUN mkdir -p __generated__/

ENV SKIP_ENV_VALIDATION true

RUN pnpm build

FROM node:22-alpine AS release
WORKDIR /app
RUN corepack enable

# add curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=base /app/apps/accounts/node_modules ./node_modules
COPY --from=base /app/apps/accounts/package.json ./package.json
COPY --from=base /app/apps/accounts/.next ./.next

EXPOSE 5002

CMD ["pnpm", "start"]