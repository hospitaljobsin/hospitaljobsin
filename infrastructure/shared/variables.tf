variable "domain_name" {
  type        = string
  description = "Domain name for the application."
  default     = "hospitaljobs.in"
}

variable "github_repository_full_name" {
  type        = string
  description = "GitHub repository full name."
  default     = "hospitaljobsin/hospitaljobsin"
}


variable "github_organization_name" {
  type        = string
  description = "GitHub organization name."
  default     = "hospitaljobsin"
}

variable "sentry_organization_slug" {
  description = "The slug of the Sentry organization."
  type        = string
  default     = "hospitaljobsin"
}
