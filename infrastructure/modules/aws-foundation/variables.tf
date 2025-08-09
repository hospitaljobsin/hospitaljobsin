variable "domain_name" {
  type        = string
  description = "Production domain name for the application."
}

variable "resource_prefix" {
  type        = string
  description = "The prefix to use for all resources."
}

variable "aws_region" {
  type        = string
  description = "Location for all AWS resources."
}

variable "github_repository_name" {
  type        = string
  description = "The name of the GitHub repository."
}
