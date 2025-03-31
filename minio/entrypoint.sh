#!/bin/bash
set -e

# Start the MinIO server in the background using the original Bitnami startup script
echo "Starting MinIO server..."
/opt/bitnami/scripts/minio/run.sh &
MINIO_PID=$!

# Wait until the MinIO server health check passes
echo "Waiting for MinIO server to become healthy..."
until curl -s ${MINIO_SERVER_URL}/minio/health/live >/dev/null; do
  sleep 1
done

echo "MinIO server is healthy. Configuring bucket policy for anonymous GET access..."

# Configure mc alias using environment variables for credentials
mc alias set myminio ${MINIO_SERVER_URL} "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"

# Check if the bucket policy is already set.
CURRENT_POLICIES=$(mc anonymous get myminio/avatars)
echo "Current anonymous access policies for 'avatars' bucket: ${CURRENT_POLICIES}"

if ! echo "${CURRENT_POLICIES}" | grep -q "download"; then
  echo "Policy is not set to 'download'. Updating policy..."
  mc anonymous set download myminio/avatars
else
  echo "Policy already set to 'download'. No update needed."
fi

echo "Bucket policy configuration complete. Foregrounding MinIO process."

# Wait for the MinIO server process to exit
wait ${MINIO_PID}
