ARG PYTHON_BASE=3.13-alpine
# build stage
FROM python:$PYTHON_BASE AS builder

# install UV
COPY --from=ghcr.io/astral-sh/uv:python3.13-alpine /uv /uvx /bin/

WORKDIR /project

# Copy the application files
COPY . .

# Install dependencies
RUN uv sync --frozen

# production stage
FROM python:$PYTHON_BASE AS development


# Install curl
RUN apk add --no-cache curl


# Install any Python build‑deps for wheels
RUN apk add --no-cache \
      build-base \
      linux-headers \
      libjpeg-turbo-dev \
      zlib-dev \
      openssl-dev \
      libffi-dev

COPY --from=builder /project/.venv/ /project/.venv

# Set environment variables for Python
ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"
# set command/entrypoint, adapt to fit your needs
COPY ./ ./project/

WORKDIR /project

EXPOSE 8000

CMD ["python", "scripts/run_server.py"]


FROM alpine:latest AS layer-build

# Set AWS environment variables with optional defaults
ARG AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-"us-east-1"}
ARG AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-""}
ARG AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-""}
ENV AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

RUN apk add aws-cli curl unzip

# Create directory for the layer
RUN mkdir -p /opt

# Download the layer from AWS Lambda
RUN curl $(aws lambda get-layer-version-by-arn --arn arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:17 --query 'Content.Location' --output text) --output layer.zip

# Unzip the downloaded layer and clean up
RUN unzip layer.zip -d /opt && \
    rm layer.zip

FROM public.ecr.aws/docker/library/python:$PYTHON_BASE AS production

# Install any Python build‑deps for wheels
RUN apk add --no-cache \
      build-base \
      linux-headers \
      libjpeg-turbo-dev \
      zlib-dev \
      openssl-dev \
      libffi-dev

COPY --from=ghcr.io/astral-sh/uv:python3.13-alpine /uv /uvx /bin/

COPY --from=layer-build /opt/extensions /opt/extensions


ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1

# Set the working directory
WORKDIR /project

# Copy the application files
COPY . .

# Install dependencies
RUN uv sync --frozen

# Set environment variables for Python
ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"

ENTRYPOINT [ "python", "-m", "awslambdaric" ]

# Set the Lambda handler
CMD ["app.lambda_handler.handler"]