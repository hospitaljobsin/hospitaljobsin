ARG PYTHON_BASE=3.13.5-slim-bookworm

FROM python:$PYTHON_BASE AS production-server

COPY --from=ghcr.io/astral-sh/uv:0.7.21 /uv /uvx /bin/

# this errors out for some reason
# ENV READINESS_CHECK_PATH = "/health/"

# ENV PORT=8000
# ENV AWS_LWA_ASYNC_INIT=true
# ENV AWS_LWA_ENABLE_COMPRESSION=true

# ENV RUST_BACKTRACE=full

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
# COPY . .
COPY app/ ./app/
COPY scripts/ ./scripts/
COPY pyproject.toml uv.lock ./

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


# Set environment variables for Python
# FIXME: setup venv correctly for lambda
ENV PYTHONPATH="/var/task:$PYTHONPATH"
# ENV PATH="/var/task/.venv/bin:$PATH"

EXPOSE 4444

# Set the Lambda handler
CMD ["python", "scripts/run_server.py"]
