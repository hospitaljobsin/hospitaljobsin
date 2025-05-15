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

COPY ./apps/accounts/package.json ./apps/accounts/pnpm-lock.yaml ./apps/accounts/.npmrc ./apps/accounts/
COPY ./schema/ ./schema/

WORKDIR /app/apps/accounts

RUN pnpm install --frozen-lockfile --shamefully-hoist

COPY ./apps/accounts/ ./

RUN mkdir -p __generated__/

ENV SKIP_ENV_VALIDATION=true

# Add these lines for each NEXT_PUBLIC variable
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
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
# Add any other NEXT_PUBLIC variables your app needs

RUN pnpm build

FROM node:24-alpine AS release
WORKDIR /app
RUN corepack enable

# add curl
RUN apk --no-cache add curl

COPY --from=base /app/apps/accounts/node_modules ./node_modules
COPY --from=base /app/apps/accounts/package.json ./package.json
COPY --from=base /app/apps/accounts/.next ./.next

EXPOSE 5002

CMD ["pnpm", "start"]