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

# Use the AWS Lambda Python 3.12 base image
FROM public.ecr.aws/docker/library/python:$PYTHON_BASE AS production

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set the working directory
WORKDIR /project

# Copy the application files
COPY . .

# Install dependencies
RUN uv sync --frozen


# Download and install the AWS Parameters and Secrets Lambda Extension
RUN curl -sSL \
    https://aws-parameters-and-secrets-lambda-extension.s3.us-east-1.amazonaws.com/AWS-Parameters-and-Secrets-Lambda-Extension-17.zip \
    -o /tmp/extension.zip && \
    unzip /tmp/extension.zip -d /opt && \
    chmod +x /opt/extensions/* && \
    rm /tmp/extension.zip

# Set environment variables for Python
ENV PYTHONPATH="/project"
ENV PATH="/project/.venv/bin:$PATH"

ENTRYPOINT [ "python", "-m", "awslambdaric" ]

# Set the Lambda handler
CMD ["app.lambda_handler.handler"]