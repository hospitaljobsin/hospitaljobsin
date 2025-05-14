variable "sentry_organization_slug" {
  description = "The slug of the Sentry organization."
  type        = string
}


variable "github_repository_full_name" {
  type        = string
  description = "GitHub repository name."
}

variable "github_organization_name" {
  type        = string
  description = "GitHub organization name."
}


variable "domain_name" {
  type        = string
  description = "Domain name for the application."
}
