resource "aws_lambda_function" "worker" {
  function_name = "${var.resource_prefix}-worker-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.analyze_job_applicants.lambda_handler"]
  }

  publish = true

  environment {
    variables = {
      SERVER_DEBUG                     = "False"
      SERVER_ENVIRONMENT               = "production"
      SERVER_DATABASE_URL              = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME     = var.mongodb_database_name
      SERVER_HOST                      = "0.0.0.0"
      SERVER_PORT                      = "8000"
      SERVER_LOG_LEVEL                 = "DEBUG"
      SERVER_CORS_ALLOW_ORIGINS        = "[\"https://${var.domain_name}\", \"https://recruiter.${var.domain_name}\", \"https://accounts.${var.domain_name}\"]"
      SERVER_CORS_ALLOW_ORIGIN_REGEX   = "https://.*\\.${var.escaped_domain}"
      SERVER_SESSION_COOKIE_DOMAIN     = ".${var.domain_name}"
      SERVER_SESSION_COOKIE_SECURE     = "True"
      SERVER_EMAIl_PROVIDER            = "aws_ses"
      SERVER_EMAIL_FROM                = var.ses_email_identity
      SERVER_S3_BUCKET_NAME            = var.s3_bucket_name
      SERVER_ACCOUNTS_BASE_URL         = "https://accounts.${var.domain_name}"
      SERVER_RECRUITER_PORTAL_BASE_URL = "https://recruiter.${var.domain_name}"
      SERVER_SEEKER_PORTAL_BASE_URL    = "https://${var.domain_name}"
      SERVER_BASE_DOMAIN               = var.domain_name
      SERVER_RP_ID                     = var.domain_name
      SERVER_RP_NAME                   = var.app_name
      SERVER_RP_EXPECTED_ORIGIN        = "https://accounts.${var.domain_name}"
      SERVER_SENTRY_DSN                = var.sentry_backend_dsn
      SERVER_PERSISTED_QUERIES_PATH    = "query_map.json"
      SERVER_REDIS_HOST                = var.redis_host
      SERVER_REDIS_PORT                = var.redis_port
      SERVER_REDIS_USERNAME            = "default"
      SERVER_REDIS_SSL                 = "True"
      SERVER_SQS_QUEUE_URL             = var.sqs_queue_url
      AWS_SECRETS_MANAGER_SECRET_ID    = var.secrets_manager_secret_id
    }
  }

  memory_size = 4096
  timeout     = 60
}

resource "aws_lambda_event_source_mapping" "worker" {
  event_source_arn        = var.sqs_queue_arn
  function_name           = aws_lambda_function.worker.arn
  batch_size              = 10
  function_response_types = ["ReportBatchItemFailures"]

  tags = {
    Environment = var.environment_name
  }

  scaling_config {
    maximum_concurrency = 25
  }
}
