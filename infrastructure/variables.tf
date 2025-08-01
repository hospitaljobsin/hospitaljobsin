variable "app_name" {
  type    = string
  default = "Hospital Jobs"
}

variable "domain_name" {
  type        = string
  description = "Domain name for the application."
  default     = "hospitaljobs.in"
}

variable "resource_prefix" {
  type        = string
  description = "The prefix to use for all resources."
  default     = "hj"
}

variable "aws_region" {
  type        = string
  description = "Location for all AWS resources."
  default     = "us-east-1"
}

variable "mongodb_atlas_region" {
  type        = string
  description = "MongoDB Atlas region."
  default     = "US_EAST_1"
}

variable "mongodb_atlas_org_id" {
  type        = string
  description = "MongoDB Atlas organization ID."
}


variable "mongodb_database_name" {
  type        = string
  description = "MongoDB database name."
  default     = "medicaljobs"
}

variable "github_repository_full_name" {
  type        = string
  description = "GitHub repository full name."
  default     = "hospitaljobsin/hospitaljobsin"
}


variable "github_repository_name" {
  type        = string
  description = "GitHub repository name."
  default     = "hospitaljobsin"
}

variable "github_organization_name" {
  type        = string
  description = "GitHub organization name."
  default     = "hospitaljobsin"
}
variable "cloudflare_account_id" {
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

variable "sentry_organization_slug" {
  description = "The slug of the Sentry organization."
  type        = string
  default     = "hospitaljobsin"
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


variable "fast2sms_api_key" {
  type        = string
  description = "Fast2SMS API key."
  sensitive   = true
}
