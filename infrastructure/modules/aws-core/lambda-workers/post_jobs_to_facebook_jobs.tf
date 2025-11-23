resource "aws_lambda_function" "post_jobs_to_facebook_jobs" {
  function_name = "${var.resource_prefix}-post-jobs-to-facebook-jobs-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.post_jobs_to_facebook_jobs.lambda_handler"]
  }

  publish = true

  environment {
    variables = {
      SERVER_DATABASE_URL               = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME      = var.mongodb_database_name
      SERVER_REDIS_HOST                 = var.redis_host
      SERVER_REDIS_PORT                 = var.redis_port
      SERVER_REDIS_USERNAME             = "default"
      SERVER_REDIS_SSL                  = "True"
      SERVER_LOG_LEVEL                  = "DEBUG"
      SERVER_ENVIRONMENT                = var.environment_name
      SERVER_DEBUG                      = "True"
      SERVER_SENTRY_DSN                 = var.sentry_backend_dsn
      SERVER_SEEKER_PORTAL_BASE_URL     = "https://${var.domain_name}"
      SERVER_FACEBOOK_APP_ID            = var.facebook_app_id
      SERVER_FACEBOOK_APP_SECRET        = var.facebook_app_secret
      SERVER_FACEBOOK_JOBS_ACCESS_TOKEN = var.facebook_jobs_access_token
      SERVER_FACEBOOK_PAGE_ID           = var.facebook_page_id
    }
  }

  memory_size = 512
  timeout     = 300
}

resource "aws_cloudwatch_event_rule" "post_jobs_to_facebook_jobs_schedule" {
  name                = "${var.resource_prefix}-post-jobs-to-facebook-jobs-schedule"
  description         = "Trigger post_jobs_to_facebook_jobs lambda function 4 times daily"
  schedule_expression = "cron(0 1,7,13,19 * * ? *)" # Every 6 hours at 01:00, 07:00, 13:00, 19:00 UTC (offset by 1 hour from Google indexing)
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_target" "post_jobs_to_facebook_jobs_target" {
  rule      = aws_cloudwatch_event_rule.post_jobs_to_facebook_jobs_schedule.name
  target_id = "PostJobsToFacebookJobsTarget"
  arn       = aws_lambda_function.post_jobs_to_facebook_jobs.arn
}

resource "aws_lambda_permission" "allow_eventbridge_post_jobs_to_facebook_jobs" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_jobs_to_facebook_jobs.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.post_jobs_to_facebook_jobs_schedule.arn
}
