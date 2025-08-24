variable "vpc_id" {
  type        = string
  description = "VPC ID."
}

variable "app_name" {
  type = string
}

variable "domain_name" {
  type        = string
  description = "Domain name for the application."
}

variable "resource_prefix" {
  type        = string
  description = "The prefix to use for all resources."
}

variable "aws_region" {
  type        = string
  description = "Location for all AWS resources."
}

variable "mongodb_database_name" {
  type        = string
  description = "MongoDB database name."
}


variable "turnstile_widget_secret" {
  type        = string
  description = "Cloudflare turnstile widget secret."
  sensitive   = true
}


variable "google_oauth_client_id" {
  type        = string
  description = "Google OAuth client ID."
}

variable "google_oauth_client_secret" {
  type        = string
  description = "Google OAuth client secret."
  sensitive   = true
}


variable "sentry_backend_dsn" {
  type        = string
  description = "Sentry DSN for the backend."
}


variable "sentry_accounts_ui_dsn" {
  type        = string
  description = "Sentry DSN for the accounts UI."
}


variable "sentry_seeker_portal_ui_dsn" {
  type        = string
  description = "Sentry DSN for the seeker portal UI."
}


variable "sentry_recruiter_portal_ui_dsn" {
  type        = string
  description = "Sentry DSN for the recruiter portal UI."
}


variable "redis_password" {
  type        = string
  description = "Redis password."
  sensitive   = true
}


variable "redis_endpoint" {
  type        = string
  description = "Redis endpoint."
}

variable "mongodb_connection_string" {
  type        = string
  description = "MongoDB connection string."
}

variable "whatsapp_access_token" {
  type        = string
  description = "Whatsapp access token."
  sensitive   = true
}

variable "whatsapp_phone_number_id" {
  type        = string
  description = "Whatsapp phone number ID."
}


variable "two_factor_in_api_key" {
  type        = string
  description = "Two Factor IN API key."
  sensitive   = true
}

variable "posthog_api_key" {
  type        = string
  description = "PostHog API key."
  sensitive   = true
}

variable "posthog_api_host" {
  type        = string
  description = "PostHog API host."
}


variable "environment_name" {
  type        = string
  description = "Environment name."
}


variable "hosted_zone_id" {
  type        = string
  description = "Hosted zone ID."
}


variable "aws_lambda_worker_repository_url" {
  type        = string
  description = "AWS Lambda worker repository URL."
}

variable "aws_lambda_backend_repository_url" {
  type        = string
  description = "AWS Lambda backend repository URL."
}
