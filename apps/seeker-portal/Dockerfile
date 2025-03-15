FROM node:22 AS base
WORKDIR /app
RUN corepack enable
COPY ./apps/seeker-portal/package.json ./apps/seeker-portal/pnpm-lock.yaml ./apps/seeker-portal/.npmrc ./apps/seeker-portal/
COPY ./schema/ ./schema/

WORKDIR /app/apps/seeker-portal

RUN pnpm install --frozen-lockfile --shamefully-hoist

COPY ./apps/seeker-portal/ ./

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
ARG NEXT_PUBLIC_ACCOUNTS_BASE_URL
ENV NEXT_PUBLIC_ACCOUNTS_BASE_URL=$NEXT_PUBLIC_ACCOUNTS_BASE_URL
# Add any other NEXT_PUBLIC variables your app needs

RUN pnpm build

FROM node:22-alpine AS release
WORKDIR /app
RUN corepack enable

# add curl
RUN apk --no-cache add curl

COPY --from=base /app/apps/seeker-portal/node_modules ./node_modules
COPY --from=base /app/apps/seeker-portal/package.json ./package.json
COPY --from=base /app/apps/seeker-portal/.next ./.next

EXPOSE 5000

CMD ["pnpm", "start"]