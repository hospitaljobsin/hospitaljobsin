resource "aws_lambda_function" "send_job_alerts" {
  # depends_on    = [docker_registry_image.backend]
  count         = var.environment_name == "production" ? 1 : 0
  function_name = "${var.resource_prefix}-send-job-alerts-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_job_alerts_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.send_job_alerts.lambda_handler"]
  }

  publish = true

  # VPC Configuration - uncomment this while moving to private subnets
  # vpc_config {
  #   subnet_ids         = values(aws_subnet.private)[*].id
  #   security_group_ids = [aws_security_group.lambda.id] # Security group for Lambda
  # }

  environment {
    variables = {
      SERVER_DATABASE_URL              = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME     = var.mongodb_database_name
      SERVER_REDIS_HOST                = var.redis_host
      SERVER_REDIS_PORT                = var.redis_port
      SERVER_REDIS_USERNAME            = "default"
      SERVER_REDIS_SSL                 = "True"
      SERVER_LOG_LEVEL                 = "DEBUG"
      SERVER_ENVIRONMENT               = var.environment_name
      SERVER_DEBUG                     = "True"
      SERVER_EMAIl_PROVIDER            = "aws_ses"
      SERVER_EMAIL_FROM                = var.ses_email_identity
      SERVER_ACCOUNTS_BASE_URL         = "https://accounts.${var.domain_name}"
      SERVER_RECRUITER_PORTAL_BASE_URL = "https://recruiter.${var.domain_name}"
      SERVER_SEEKER_PORTAL_BASE_URL    = "https://${var.domain_name}"
      SERVER_BASE_DOMAIN               = var.domain_name
      SERVER_SENTRY_DSN                = var.sentry_backend_dsn
      SERVER_WHATSAPP_ACCESS_TOKEN     = var.whatsapp_access_token
      SERVER_WHATSAPP_PHONE_NUMBER_ID  = var.whatsapp_phone_number_id
    }
  }

  memory_size = 1024
  timeout     = 60
}


resource "aws_lambda_event_source_mapping" "send_job_alerts" {
  count            = var.environment_name == "production" ? 1 : 0
  event_source_arn = var.sqs_job_alerts_queue_arn
  function_name    = aws_lambda_function.send_job_alerts[0].arn
  batch_size       = 10

  function_response_types = ["ReportBatchItemFailures"]

  tags = {
    Environment = var.environment_name
  }

  scaling_config {
    maximum_concurrency = 25
  }
}
