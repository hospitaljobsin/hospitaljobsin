resource "aws_lambda_function" "automation_generate_wa_messages" {
  function_name = "${var.resource_prefix}-automation-generate-wa-messages-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.generate_whatsapp_messages.lambda_handler"]
  }

  publish = true

  environment {
    variables = {
      SERVER_DATABASE_URL              = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME     = var.mongodb_database_name
      SERVER_REDIS_HOST                = var.redis_host
      SERVER_REDIS_PORT                = var.redis_port
      SERVER_REDIS_USERNAME            = "default"
      SERVER_REDIS_SSL                 = "True"
      SERVER_LOG_LEVEL                 = "DEBUG"
      SERVER_DEBUG                     = "True"
      SERVER_ENVIRONMENT               = "production"
      SERVER_EMAIl_PROVIDER            = "aws_ses"
      SERVER_EMAIL_FROM                = var.ses_email_identity
      SERVER_SENTRY_DSN                = var.sentry_backend_dsn
      SERVER_ACCOUNTS_BASE_URL         = "https://accounts.${var.domain_name}"
      SERVER_RECRUITER_PORTAL_BASE_URL = "https://recruiter.${var.domain_name}"
      SERVER_SEEKER_PORTAL_BASE_URL    = "https://${var.domain_name}"
      SERVER_BASE_DOMAIN               = var.domain_name
    }
  }

  memory_size = 1024
  timeout     = 60
}

resource "aws_cloudwatch_event_rule" "automation_generate_wa_messages_schedule" {
  count               = var.environment_name == "production" ? 1 : 0
  name                = "${var.resource_prefix}-automation-generate-wa-messages-schedule"
  description         = "Trigger automation_generate_wa_messages lambda function daily"
  schedule_expression = "cron(0 14 * * ? *)"
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_target" "automation_generate_wa_messages_target" {
  count     = var.environment_name == "production" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.automation_generate_wa_messages_schedule[0].name
  target_id = "AutomationGenerateWaMessagesTarget"
  arn       = aws_lambda_function.automation_generate_wa_messages.arn
}

resource "aws_lambda_permission" "allow_eventbridge_automation_generate_wa_messages" {
  count         = var.environment_name == "production" ? 1 : 0
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.automation_generate_wa_messages.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.automation_generate_wa_messages_schedule[0].arn
}
