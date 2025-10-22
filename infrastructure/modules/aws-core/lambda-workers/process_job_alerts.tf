resource "aws_lambda_function" "process_job_alerts" {
  # depends_on    = [docker_registry_image.backend]
  count         = var.environment_name == "production" ? 1 : 0
  function_name = "${var.resource_prefix}-process-job-alerts-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_job_alerts_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.process_job_alerts.lambda_handler"]
  }

  publish = true

  # VPC Configuration - uncomment this while moving to private subnets
  # vpc_config {
  #   subnet_ids         = values(aws_subnet.private)[*].id
  #   security_group_ids = [aws_security_group.lambda.id] # Security group for Lambda
  # }

  environment {
    variables = {
      SERVER_SQS_JOB_ALERTS_QUEUE_URL = var.sqs_job_alerts_queue_url
      SERVER_DATABASE_URL             = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME    = var.mongodb_database_name
      SERVER_LOG_LEVEL                = "DEBUG"
      SERVER_ENVIRONMENT              = var.environment_name
      SERVER_DEBUG                    = "True"
      SERVER_SENTRY_DSN               = var.sentry_backend_dsn
    }
  }

  memory_size = 1024
  timeout     = 60
}

# EventBridge rules to trigger process_job_alerts lambda with different frequencies
resource "aws_cloudwatch_event_rule" "process_job_alerts_daily_schedule" {
  count               = var.environment_name == "production" ? 1 : 0
  name                = "${var.resource_prefix}-process-job-alerts-daily-schedule"
  description         = "Trigger process_job_alerts lambda function daily"
  schedule_expression = "cron(0 6 * * ? *)" # Every day at 6 AM UTC
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_rule" "process_job_alerts_weekly_schedule" {
  count               = var.environment_name == "production" ? 1 : 0
  name                = "${var.resource_prefix}-process-job-alerts-weekly-schedule"
  description         = "Trigger process_job_alerts lambda function weekly"
  schedule_expression = "cron(0 6 ? * MON *)" # Every Monday at 6 AM UTC
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_rule" "process_job_alerts_monthly_schedule" {
  count               = var.environment_name == "production" ? 1 : 0
  name                = "${var.resource_prefix}-process-job-alerts-monthly-schedule"
  description         = "Trigger process_job_alerts lambda function monthly"
  schedule_expression = "cron(0 6 1 * ? *)" # First day of every month at 6 AM UTC
  tags = {
    Environment = var.environment_name
  }
}

# EventBridge targets to invoke the process_job_alerts lambda function with different input data
resource "aws_cloudwatch_event_target" "process_job_alerts_daily_target" {
  count     = var.environment_name == "production" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.process_job_alerts_daily_schedule[0].name
  target_id = "ProcessJobAlertsDailyTarget"
  arn       = aws_lambda_function.process_job_alerts[0].arn
  input = jsonencode({
    frequency = "daily"
  })
}

resource "aws_cloudwatch_event_target" "process_job_alerts_weekly_target" {
  count     = var.environment_name == "production" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.process_job_alerts_weekly_schedule[0].name
  target_id = "ProcessJobAlertsWeeklyTarget"
  arn       = aws_lambda_function.process_job_alerts[0].arn
  input = jsonencode({
    frequency = "weekly"
  })
}

resource "aws_cloudwatch_event_target" "process_job_alerts_monthly_target" {
  count     = var.environment_name == "production" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.process_job_alerts_monthly_schedule[0].name
  target_id = "ProcessJobAlertsMonthlyTarget"
  arn       = aws_lambda_function.process_job_alerts[0].arn
  input = jsonencode({
    frequency = "monthly"
  })
}

# Permissions for EventBridge to invoke the process_job_alerts lambda function
resource "aws_lambda_permission" "allow_eventbridge_process_job_alerts_daily" {
  count         = var.environment_name == "production" ? 1 : 0
  statement_id  = "AllowExecutionFromEventBridgeDaily"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.process_job_alerts[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.process_job_alerts_daily_schedule[0].arn
}

resource "aws_lambda_permission" "allow_eventbridge_process_job_alerts_weekly" {
  count         = var.environment_name == "production" ? 1 : 0
  statement_id  = "AllowExecutionFromEventBridgeWeekly"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.process_job_alerts[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.process_job_alerts_weekly_schedule[0].arn
}

resource "aws_lambda_permission" "allow_eventbridge_process_job_alerts_monthly" {
  count         = var.environment_name == "production" ? 1 : 0
  statement_id  = "AllowExecutionFromEventBridgeMonthly"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.process_job_alerts[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.process_job_alerts_monthly_schedule[0].arn
}
