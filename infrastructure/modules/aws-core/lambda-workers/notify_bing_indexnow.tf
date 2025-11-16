resource "aws_lambda_function" "notify_bing_indexnow" {
  function_name = "${var.resource_prefix}-notify-bing-indexnow-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.notify_bing_indexnow.lambda_handler"]
  }

  publish = true

  environment {
    variables = {
      SERVER_DATABASE_URL           = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME  = var.mongodb_database_name
      SERVER_REDIS_HOST             = var.redis_host
      SERVER_REDIS_PORT             = var.redis_port
      SERVER_REDIS_USERNAME         = "default"
      SERVER_REDIS_SSL              = "True"
      SERVER_LOG_LEVEL              = "DEBUG"
      SERVER_ENVIRONMENT            = var.environment_name
      SERVER_DEBUG                  = "True"
      SERVER_SENTRY_DSN             = var.sentry_backend_dsn
      SERVER_SEEKER_PORTAL_BASE_URL = "https://${var.domain_name}"
      SERVER_BING_INDEXNOW_API_KEY  = var.bing_indexnow_api_key
    }
  }

  memory_size = 512
  timeout     = 300
}

resource "aws_cloudwatch_event_rule" "notify_bing_indexnow_schedule" {
  name                = "${var.resource_prefix}-notify-bing-indexnow-schedule"
  description         = "Trigger notify_bing_indexnow lambda function 4 times daily"
  schedule_expression = "cron(0 0,6,12,18 * * ? *)" # Every 6 hours at 00:00, 06:00, 12:00, 18:00 UTC
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_target" "notify_bing_indexnow_target" {
  rule      = aws_cloudwatch_event_rule.notify_bing_indexnow_schedule.name
  target_id = "NotifyBingIndexNowTarget"
  arn       = aws_lambda_function.notify_bing_indexnow.arn
}

resource "aws_lambda_permission" "allow_eventbridge_notify_bing_indexnow" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notify_bing_indexnow.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.notify_bing_indexnow_schedule.arn
}
