FROM node:23 AS base
WORKDIR /app
RUN corepack enable
COPY ./apps/recruiter-portal/package.json ./apps/recruiter-portal/pnpm-lock.yaml ./apps/recruiter-portal/.npmrc ./apps/recruiter-portal/
COPY ./schema/ ./schema/

WORKDIR /app/apps/recruiter-portal

RUN pnpm install --frozen-lockfile --shamefully-hoist

COPY ./apps/recruiter-portal/ ./

RUN mkdir -p __generated__/

ENV SKIP_ENV_VALIDATION true

# Add these lines for each NEXT_PUBLIC variable
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_CAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_CAPTCHA_SITE_KEY=$NEXT_PUBLIC_CAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL
ENV NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL=$NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL
ARG NEXT_PUBLIC_ACCOUNTS_BASE_URL
ENV NEXT_PUBLIC_ACCOUNTS_BASE_URL=$NEXT_PUBLIC_ACCOUNTS_BASE_URL
# Add any other NEXT_PUBLIC variables your app needs

RUN pnpm build

FROM node:23-alpine AS release
WORKDIR /app
RUN corepack enable

# add curl
RUN apk --no-cache add curl

COPY --from=base /app/apps/recruiter-portal/node_modules ./node_modules
COPY --from=base /app/apps/recruiter-portal/package.json ./package.json
COPY --from=base /app/apps/recruiter-portal/.next ./.next

EXPOSE 5001

CMD ["pnpm", "start"]