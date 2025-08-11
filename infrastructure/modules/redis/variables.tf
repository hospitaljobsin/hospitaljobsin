variable "aws_region" {
  type        = string
  description = "The AWS region to deploy the Redis database to"
}


variable "resource_prefix" {
  type        = string
  description = "The prefix to use for the Redis database resource names"
}


variable "environment_name" {
  type        = string
  description = "Environment name."
}
