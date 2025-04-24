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

variable "certificate_arn" {
  type        = string
  description = "The ARN of the ACM certificate for the domain."
}


variable "hosted_zone_id" {
  type        = string
  description = "The Route53 hosted zone ID for your domain name."
}

variable "domain_name" {
  type        = string
  description = "Domain name for the application."
}
