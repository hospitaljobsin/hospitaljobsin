# variable "domain_name" {
#   type        = string
#   description = "Domain name for the application."
# }

variable "resource_prefix" {
  type        = string
  description = "The prefix to use for all resources."
}

variable "aws_region" {
  type        = string
  description = "Location for all AWS resources."
}
