FROM bitnami/minio:latest

# Switch to root to install additional tools
USER root

# Copy our custom entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch back to the non-root user (Bitnami image default, adjust if necessary)
USER 1001

# Use our entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
