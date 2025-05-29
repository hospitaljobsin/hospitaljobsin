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

variable "mongodb_atlas_region" {
  type        = string
  description = "MongoDB Atlas region."
}

variable "mongodb_atlas_org_id" {
  type        = string
  description = "MongoDB Atlas organization ID."
}


variable "mongodb_database_name" {
  type        = string
  description = "MongoDB database name."
}


variable "github_repository_name" {
  type        = string
  description = "GitHub repository name."
}

variable "cloudflare_acount_id" {
  type        = string
  description = "Cloudflare account ID."
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
