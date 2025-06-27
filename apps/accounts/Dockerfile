FROM node:24-alpine AS base

# Update
RUN apk add --no-cache libc6-compat
RUN apk update

# Install pnpm
RUN npm install -g pnpm@latest-10

# Configure pnpm global
ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PATH:$PNPM_HOME

WORKDIR /app

COPY ./apps/accounts/package.json ./apps/accounts/.npmrc ./apps/accounts/
COPY ./schema/ ./schema/
# Copy root-level workspace config and lockfiles
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

RUN pnpm install --filter accounts --frozen-lockfile --shamefully-hoist

# WORKDIR /app/apps/accounts

ENV SKIP_ENV_VALIDATION=true

# Add these lines for each NEXT_PUBLIC variable
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_INTERNAL_API_URL
ENV NEXT_PUBLIC_INTERNAL_API_URL=$NEXT_PUBLIC_INTERNAL_API_URL
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_CAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_CAPTCHA_SITE_KEY=$NEXT_PUBLIC_CAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL
ENV NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL=$NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL
ARG NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL
ENV NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL=$NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL
ARG NEXT_PUBLIC_SESSION_COOKIE_KEY
ENV NEXT_PUBLIC_SESSION_COOKIE_KEY=$NEXT_PUBLIC_SESSION_COOKIE_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ORGANIZATION
ENV NEXT_PUBLIC_SENTRY_ORGANIZATION=$NEXT_PUBLIC_SENTRY_ORGANIZATION
ARG NEXT_PUBLIC_SENTRY_PROJECT
ENV NEXT_PUBLIC_SENTRY_PROJECT=$NEXT_PUBLIC_SENTRY_PROJECT
ARG NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_ROOT_DOMAIN
ENV NEXT_PUBLIC_ROOT_DOMAIN=NEXT_PUBLIC_ROOT_DOMAIN
# Add any other NEXT_PUBLIC variables your app needs

COPY ./apps/accounts/ ./apps/accounts/

RUN pnpm --filter accounts run relay --validate

RUN pnpm --filter accounts build

FROM node:24-alpine AS release
WORKDIR /app
RUN corepack enable

# add curl
RUN apk --no-cache add curl

# Copy full monorepo-level node_modules
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=base /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=base /app/package.json ./package.json

# Copy app-specific output and files
COPY --from=base /app/apps/accounts/.next ./apps/accounts/.next
COPY --from=base /app/apps/accounts/package.json ./apps/accounts/package.json

EXPOSE 5002

CMD ["pnpm", "--filter", "accounts", "start"]
