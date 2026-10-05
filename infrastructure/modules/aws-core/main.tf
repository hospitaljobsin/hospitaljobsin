terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.67"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "3.6.0"
    }

  }
}


provider "aws" {
  region            = var.aws_region
  s3_use_path_style = true
}

data "aws_caller_identity" "current" {}

# data "aws_region" "current" {}


provider "docker" {
  host = "unix:///var/run/docker.sock"
}

module "lambda_workers" {
  source = "./lambda-workers"

  environment_name                     = var.environment_name
  resource_prefix                      = var.resource_prefix
  aws_lambda_worker_repository_url     = var.aws_lambda_worker_repository_url
  mongodb_connection_string            = var.mongodb_connection_string
  mongodb_database_name                = var.mongodb_database_name
  domain_name                          = var.domain_name
  escaped_domain                       = local.escaped_domain
  app_name                             = var.app_name
  sentry_backend_dsn                   = var.sentry_backend_dsn
  ses_email_identity                   = aws_ses_email_identity.this.email
  redis_host                           = tostring(local.redis_host)
  redis_port                           = tostring(local.redis_port)
  whatsapp_access_token                = var.whatsapp_access_token
  whatsapp_phone_number_id             = var.whatsapp_phone_number_id
  sqs_job_alerts_queue_url             = aws_sqs_queue.job_alerts.url
  sqs_job_alerts_queue_arn             = aws_sqs_queue.job_alerts.arn
  sqs_queue_url                        = aws_sqs_queue.this.url
  sqs_queue_arn                        = aws_sqs_queue.this.arn
  s3_bucket_name                       = aws_s3_bucket.this.bucket
  s3_bucket_arn                        = aws_s3_bucket.this.arn
  secrets_manager_secret_id            = aws_secretsmanager_secret.backend.id
  google_indexing_service_account_json = var.google_indexing_service_account_json
  bing_indexnow_api_key                = var.bing_indexnow_api_key
  facebook_jobs_access_token           = var.facebook_jobs_access_token
  facebook_app_id                      = var.facebook_app_id
  facebook_app_secret                  = var.facebook_app_secret
  facebook_page_id                     = var.facebook_page_id
}
