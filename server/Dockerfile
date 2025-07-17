ARG PYTHON_BASE=3.13-slim

# development stage
FROM python:$PYTHON_BASE AS development-server

# Install curl
RUN apt-get update && \
    apt-get install -y build-essential curl && \
    rm -rf /var/lib/apt/lists/*


# install UV
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /project

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

# Copy the application files
COPY . .

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

# Set environment variables for Python
ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uv", "run", "scripts/run_server.py"]


FROM debian:12-slim AS layer-build

# Set AWS environment variables with optional defaults
ARG AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-"us-east-1"}
ARG AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-""}
ARG AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-""}
ENV AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

# Update package list and install dependencies
RUN apt-get update && \
    apt-get install -y awscli curl unzip && \
    rm -rf /var/lib/apt/lists/*

# Create directory for the layer
RUN mkdir -p /opt

# Download the layer from AWS Lambda
RUN curl $(aws lambda get-layer-version-by-arn --arn arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:17 --query 'Content.Location' --output text) --output layer.zip

# Unzip the downloaded layer and clean up
RUN unzip layer.zip -d /opt && \
    rm layer.zip

FROM public.ecr.aws/docker/library/python:$PYTHON_BASE AS production-server

# RUN apt-get update && \
#     apt-get install -y build-essential && \
#     rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/


COPY --from=layer-build /opt /opt

# include the AWS lambda web adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

# this errors out for some reason
# ENV READINESS_CHECK_PATH = "/health/"
ENV PORT=8000
ENV AWS_LWA_ASYNC_INIT=true
ENV AWS_LWA_ENABLE_COMPRESSION=true

ENV RUST_BACKTRACE=full

ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV UV_CACHE_DIR=/tmp/uv-cache

# Set the working directory
WORKDIR /var/task

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv export --format=requirements-txt --frozen -o requirements.txt && \
    uv pip install -r requirements.txt --system && \
    rm requirements.txt

# Copy the application files
COPY . .

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


# Set environment variables for Python
# FIXME: setup venv correctly for lambda
ENV PYTHONPATH="/var/task:$PYTHONPATH"
# ENV PATH="/var/task/.venv/bin:$PATH"


# Set the Lambda handler
CMD ["python", "scripts/run_server.py"]


FROM public.ecr.aws/docker/library/python:$PYTHON_BASE AS sqs-handler

# RUN apt-get update && \
#     apt-get install -y build-essential && \
#     rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/


COPY --from=layer-build /opt /opt


ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV UV_CACHE_DIR=/tmp/uv-cache

# Set the working directory
WORKDIR /var/task

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv export --format=requirements-txt --frozen -o requirements.txt && \
    uv pip install -r requirements.txt --system && \
    rm requirements.txt

# Copy the application files
COPY . .

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


# Install the AWS Lambda Runtime Interface Client
RUN uv pip install awslambdaric --system


# Set environment variables for Python
# FIXME: setup venv correctly for lambda
ENV PYTHONPATH="/var/task:$PYTHONPATH"
# ENV PATH="/var/task/.venv/bin:$PATH"


ENTRYPOINT [ "python", "-m", "awslambdaric" ]

# Set the Lambda handler
CMD ["app.sqs_handler.lambda_handler"]
