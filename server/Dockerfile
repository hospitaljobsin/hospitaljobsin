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


FROM alpine:latest as layer-build

ARG AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-"us-east-1"}
ARG AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-""}
ARG AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-""}
ENV AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

RUN apk add aws-cli curl unzip

RUN mkdir -p /opt

RUN curl $(aws lambda get-layer-version-by-arn --arn arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:17 --query 'Content.Location' --output text) --output layer.zip
RUN unzip layer.zip -d /opt
RUN rm layer.zip

# Use the AWS Lambda Python 3.12 base image
FROM public.ecr.aws/docker/library/python:$PYTHON_BASE AS production

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# WORKDIR /opt
# COPY --from=layer-build /opt .

WORKDIR /opt/extensions
COPY --from=layer-build /opt/extensions/ .

# Ensure that all extensions are executable
RUN chmod -R +x /opt/extensions

ENV PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL=debug
ENV AWS_LAMBDA_LOG_FORMAT=json

# Set the working directory
WORKDIR /project

# Copy the application files
COPY . .

# Install dependencies
RUN uv sync --frozen


# Set environment variables for Python
ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"

# TODO: maybe entrypoint isnt allowing extensions to initialize normally
ENTRYPOINT [ "python", "-m", "awslambdaric" ]

# Set the Lambda handler
CMD ["app.lambda_handler.handler"]