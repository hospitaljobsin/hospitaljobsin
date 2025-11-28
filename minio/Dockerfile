FROM minio/minio:latest

# Switch to root to install additional tools
USER root

# Copy our custom entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch back to minio user (default user in official MinIO image is "minio" with UID 1000)
USER minio

# Use our entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
