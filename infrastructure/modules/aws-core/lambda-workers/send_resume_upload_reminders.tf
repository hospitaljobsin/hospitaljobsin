resource "aws_lambda_function" "send_resume_upload_reminders" {
  count         = var.environment_name == "production" ? 1 : 0
  function_name = "${var.resource_prefix}-send-resume-upload-reminders-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.send_resume_upload_reminders.lambda_handler"]
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
      SERVER_ENVIRONMENT               = var.environment_name
      SERVER_DEBUG                     = "True"
      SERVER_EMAIL_PROVIDER            = "aws_ses"
      SERVER_EMAIL_FROM                = var.ses_email_identity
      SERVER_ACCOUNTS_BASE_URL         = "https://accounts.${var.domain_name}"
      SERVER_RECRUITER_PORTAL_BASE_URL = "https://recruiter.${var.domain_name}"
      SERVER_SEEKER_PORTAL_BASE_URL    = "https://${var.domain_name}"
      SERVER_BASE_DOMAIN               = var.domain_name
      SERVER_SENTRY_DSN                = var.sentry_backend_dsn
    }
  }

  memory_size = 512
  timeout     = 300
}

resource "aws_cloudwatch_event_rule" "send_resume_upload_reminders_schedule" {
  count               = var.environment_name == "production" ? 1 : 0
  name                = "${var.resource_prefix}-send-resume-upload-reminders-schedule"
  description         = "Trigger send_resume_upload_reminders lambda function daily"
  schedule_expression = "cron(0 10 * * ? *)" # Every day at 10 AM UTC
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_target" "send_resume_upload_reminders_target" {
  count     = var.environment_name == "production" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.send_resume_upload_reminders_schedule[0].name
  target_id = "SendResumeUploadRemindersTarget"
  arn       = aws_lambda_function.send_resume_upload_reminders[0].arn
}

resource "aws_lambda_permission" "allow_eventbridge_send_resume_upload_reminders" {
  count         = var.environment_name == "production" ? 1 : 0
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.send_resume_upload_reminders[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.send_resume_upload_reminders_schedule[0].arn
}
