
variable "app_name" {
  type    = string
  default = "Hospital Job Board"
}

variable "resource_prefix" {
  type        = string
  description = "The prefix to use for all resources."
  default     = "mj"
}


variable "aws_region" {
  type        = string
  description = "Location for all AWS resources."
  default     = "us-east-1"
}