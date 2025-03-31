#!/bin/bash
set -e

# Start the MinIO server in the background using the original Bitnami startup script.
echo "Starting MinIO server..."
/opt/bitnami/scripts/minio/run.sh &
MINIO_PID=$!

# Wait until the MinIO server health check passes.
echo "Waiting for MinIO server to become healthy..."
until curl -s "${MINIO_SERVER_URL}/minio/health/live" >/dev/null; do
  sleep 1
done

echo "MinIO server is healthy. Configuring bucket policies for anonymous GET access..."

# Configure mc alias using environment variables for credentials.
mc alias set myminio "${MINIO_SERVER_URL}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"

# Check if MINIO_DEFAULT_BUCKETS is defined.
if [ -z "${MINIO_DEFAULT_BUCKETS}" ]; then
  echo "MINIO_DEFAULT_BUCKETS is not set. Skipping bucket policy configuration."
else
  # Split the MINIO_DEFAULT_BUCKETS env var on commas into an array.
  IFS=',' read -ra BUCKET_PAIRS <<< "${MINIO_DEFAULT_BUCKETS}"
  
  # Loop through each bucket:policy pair.
  for pair in "${BUCKET_PAIRS[@]}"; do
    # Split each pair by colon (":") to extract the bucket name.
    IFS=':' read -ra parts <<< "${pair}"
    bucket="${parts[0]}"
    
    echo "Processing bucket '${bucket}'..."
    
    # Use a case statement to decide whether to configure anonymous GET access based on the bucket name.
    case "$bucket" in
      avatars)
        echo "Setting anonymous GET (download) access on '${bucket}' bucket..."
        mc anonymous set download myminio/"${bucket}"
        ;;
      # Add additional bucket cases here if needed.
      *)
        echo "No anonymous GET configuration required for bucket '${bucket}'."
        ;;
    esac
  done
fi

echo "Bucket policy configuration complete. Foregrounding MinIO process."

# Wait for the MinIO server process to exit.
wait ${MINIO_PID}
