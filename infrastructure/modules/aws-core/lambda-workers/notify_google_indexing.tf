resource "aws_lambda_function" "notify_google_indexing" {
  function_name = "${var.resource_prefix}-notify-google-indexing-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.notify_google_indexing.lambda_handler"]
  }

  publish = true

  environment {
    variables = {
      SERVER_DATABASE_URL                         = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME                = var.mongodb_database_name
      SERVER_REDIS_HOST                           = var.redis_host
      SERVER_REDIS_PORT                           = var.redis_port
      SERVER_REDIS_USERNAME                       = "default"
      SERVER_REDIS_SSL                            = "True"
      SERVER_LOG_LEVEL                            = "DEBUG"
      SERVER_ENVIRONMENT                          = var.environment_name
      SERVER_DEBUG                                = "True"
      SERVER_SENTRY_DSN                           = var.sentry_backend_dsn
      SERVER_SEEKER_PORTAL_BASE_URL               = "https://${var.domain_name}"
      SERVER_GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON = var.google_indexing_service_account_json
    }
  }

  memory_size = 512
  timeout     = 300
}

resource "aws_cloudwatch_event_rule" "notify_google_indexing_schedule" {
  name                = "${var.resource_prefix}-notify-google-indexing-schedule"
  description         = "Trigger notify_google_indexing lambda function 4 times daily"
  schedule_expression = "cron(0 0,6,12,18 * * ? *)" # Every 6 hours at 00:00, 06:00, 12:00, 18:00 UTC
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_target" "notify_google_indexing_target" {
  rule      = aws_cloudwatch_event_rule.notify_google_indexing_schedule.name
  target_id = "NotifyGoogleIndexingTarget"
  arn       = aws_lambda_function.notify_google_indexing.arn
}

resource "aws_lambda_permission" "allow_eventbridge_notify_google_indexing" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notify_google_indexing.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.notify_google_indexing_schedule.arn
}
