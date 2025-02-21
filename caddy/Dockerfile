# Build Caddy with the DigitalOcean DNS plugin
FROM caddy:2.9-builder-alpine AS builder

# RUN xcaddy build \
#     --with github.com/caddy-dns/digitalocean


# Start from the base Caddy image
FROM caddy:2.9-alpine AS development

# Copy your Caddyfile into the image
COPY ./development/Caddyfile /etc/caddy/Caddyfile

# Start from the base Caddy image
FROM caddy:2.9-alpine AS production

ARG ACME_EMAIL

# Copy the custom-built Caddy binary
COPY --from=builder /usr/bin/caddy /usr/bin/caddy

# Copy your Caddyfile into the image
COPY ./production/Caddyfile /etc/caddy/Caddyfile