ARG PYTHON_BASE=3.12-alpine3.21
# build stage
FROM python:$PYTHON_BASE AS builder

# Install system dependencies
RUN apk add --no-cache curl build-base libffi-dev openssl-dev

# Install UV (static binary)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /project

# Copy the application files
COPY . .

# Install dependencies
RUN uv sync --frozen

# development stage
FROM python:$PYTHON_BASE AS development

# Install curl
RUN apk add --no-cache curl

COPY --from=builder /project/.venv/ /project/.venv

# Set environment variables for Python
ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"

COPY ./ ./project/
WORKDIR /project
EXPOSE 8000

CMD ["python", "scripts/run_server.py"]

# layer build stage
FROM alpine:3.21 AS layer-build

ARG AWS_DEFAULT_REGION="us-east-1"
ARG AWS_ACCESS_KEY_ID=""
ARG AWS_SECRET_ACCESS_KEY=""

ENV AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

# Install awscli and required deps
RUN apk add --no-cache curl unzip groff less python3 py3-pip && \
    pip install --no-cache-dir awscli

RUN mkdir -p /opt

RUN curl $(aws lambda get-layer-version-by-arn --arn arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:17 --query 'Content.Location' --output text) --output layer.zip

RUN unzip layer.zip -d /opt && rm layer.zip

# production stage
FROM public.ecr.aws/docker/library/python:$PYTHON_BASE AS production

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY --from=layer-build /opt/extensions /opt/extensions

# RUN chmod +x /opt/extensions/*

ENV PYTHONUNBUFFERED=1

WORKDIR /project
COPY . .

RUN apk add --no-cache build-base libffi-dev openssl-dev && \
    uv sync --frozen

ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"

ENTRYPOINT [ "python", "-m", "awslambdaric" ]
CMD ["app.lambda_handler.handler"]
