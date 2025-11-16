variable "environment_name" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "aws_lambda_worker_repository_url" {
  type = string
}

variable "mongodb_connection_string" {
  type = string
}

variable "mongodb_database_name" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "escaped_domain" {
  type = string
}

variable "app_name" {
  type = string
}

variable "sentry_backend_dsn" {
  type = string
}

variable "ses_email_identity" {
  type = string
}

variable "redis_host" {
  type = string
}

variable "redis_port" {
  type = string
}

variable "whatsapp_access_token" {
  type = string
}

variable "whatsapp_phone_number_id" {
  type = string
}

variable "sqs_job_alerts_queue_url" {
  type = string
}

variable "sqs_job_alerts_queue_arn" {
  type = string
}

variable "sqs_queue_url" {
  type = string
}

variable "sqs_queue_arn" {
  type = string
}

variable "s3_bucket_name" {
  type = string
}

variable "s3_bucket_arn" {
  type = string
}

variable "secrets_manager_secret_id" {
  type = string
}

variable "google_indexing_service_account_json" {
  type      = string
  sensitive = true
}


variable "bing_indexnow_api_key" {
  type      = string
  sensitive = true
}
