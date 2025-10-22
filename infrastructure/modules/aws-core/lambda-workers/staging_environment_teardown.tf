resource "aws_lambda_function" "staging_environment_teardown" {
  count         = var.environment_name == "staging" ? 1 : 0
  function_name = "${var.resource_prefix}-staging-environment-teardown-lambda"

  tags = {
    Environment = var.environment_name
    ManagedBy   = "terraform"
    ImageType   = "worker"
  }

  role         = aws_iam_role.lambda_staging_db_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.teardown_staging_environment.lambda_handler"]
  }

  publish = true

  environment {
    variables = {
      SERVER_DATABASE_URL          = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME = var.mongodb_database_name
      SERVER_LOG_LEVEL             = "DEBUG"
      SERVER_ENVIRONMENT           = "staging"
      SERVER_DEBUG                 = "True"
    }
  }

  memory_size = 1024
  timeout     = 60
}
