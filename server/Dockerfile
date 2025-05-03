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

# Install AWS CLI and other dependencies
RUN apt-get update && \
    apt-get install -y curl unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    apt-get install -y jq && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf aws awscliv2.zip

# Create the extensions directory
RUN mkdir -p /opt/extensions

# Add AWS Parameters and Secrets Lambda Extension using the layer ARN
# This requires AWS credentials to be available during build
RUN mkdir -p /opt/extensions && \
    curl -sSL "https://aws-secrets-manager-lambda-extensions.s3.amazonaws.com/aws-parameters-and-secrets-extension-latest" \
    -o /opt/extensions/aws-parameters-and-secrets-extension && \
    chmod +x /opt/extensions/aws-parameters-and-secrets-extension



COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

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