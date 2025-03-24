FROM node:23 AS base
WORKDIR /app
RUN corepack enable
COPY ./apps/accounts/package.json ./apps/accounts/pnpm-lock.yaml ./apps/accounts/.npmrc ./apps/accounts/
COPY ./schema/ ./schema/

WORKDIR /app/apps/accounts

RUN pnpm install --frozen-lockfile --shamefully-hoist

COPY ./apps/accounts/ ./

RUN mkdir -p __generated__/

ENV SKIP_ENV_VALIDATION true

# Add these lines for each NEXT_PUBLIC variable
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL
ENV NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL=$NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL
ARG NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL
ENV NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL=$NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL
# Add any other NEXT_PUBLIC variables your app needs

RUN pnpm build

FROM node:23-alpine AS release
WORKDIR /app
RUN corepack enable

# add curl
RUN apk --no-cache add curl

COPY --from=base /app/apps/accounts/node_modules ./node_modules
COPY --from=base /app/apps/accounts/package.json ./package.json
COPY --from=base /app/apps/accounts/.next ./.next

EXPOSE 5002

CMD ["pnpm", "start"]