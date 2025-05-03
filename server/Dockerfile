ARG PYTHON_BASE=3.12.0-slim
# build stage
FROM python:$PYTHON_BASE AS builder

# install UV
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /project

# Copy the application files
COPY . .

# Install dependencies
RUN uv sync --frozen

# production stage
FROM python:$PYTHON_BASE AS development

# Install curl
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /project/.venv/ /project/.venv

# Set environment variables for Python
ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"
# set command/entrypoint, adapt to fit your needs
COPY ./ ./project/

WORKDIR /project

EXPOSE 8000

CMD ["python", "scripts/run_server.py"]


FROM debian:12-slim as layer-build

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


FROM ghcr.io/astral-sh/uv:0.7.2 AS uv

# First, bundle the dependencies into the task root.
FROM public.ecr.aws/lambda/python:3.13 AS production-builder

# Enable bytecode compilation, to improve cold-start performance.
ENV UV_COMPILE_BYTECODE=1

# Disable installer metadata, to create a deterministic layer.
ENV UV_NO_INSTALLER_METADATA=1

# Enable copy mode to support bind mount caching.
ENV UV_LINK_MODE=copy

# Bundle the dependencies into the Lambda task root via `uv pip install --target`.
#
# Omit any local packages (`--no-emit-workspace`) and development dependencies (`--no-dev`).
# This ensures that the Docker layer cache is only invalidated when the `pyproject.toml` or `uv.lock`
# files change, but remains robust to changes in the application code.
RUN --mount=from=uv,source=/uv,target=/bin/uv \
    --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv export --frozen --no-emit-workspace --no-dev --no-editable -o requirements.txt && \
    uv pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Use the AWS Lambda Python 3.12 base image
FROM public.ecr.aws/lambda/python:3.12 AS production

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# WORKDIR /opt
# COPY --from=layer-build /opt .

WORKDIR /opt/extensions
COPY --from=layer-build /opt/extensions/ .

ENV PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL=debug
ENV AWS_LAMBDA_LOG_FORMAT=json
ENV DEBUG_LOGGING_ENABLED=true


# Copy the runtime dependencies from the builder stage.
COPY --from=production-builder ${LAMBDA_TASK_ROOT} ${LAMBDA_TASK_ROOT}

# Copy the application code.
COPY ./ ${LAMBDA_TASK_ROOT}/


# TODO: maybe entrypoint isnt allowing extensions to initialize normally
# ENTRYPOINT [ "python", "-m", "awslambdaric" ]

# Set the Lambda handler
CMD ["app.lambda_handler.handler"]