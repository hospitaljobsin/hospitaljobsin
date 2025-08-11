variable "resource_prefix" {
  type        = string
  description = "The prefix to use for all resources."
  default     = "hj"
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


variable "ecs_username" {
  type        = string
  description = "ECS username."
}

variable "lambda_username" {
  type        = string
  description = "Lambda username."
}

variable "worker_username" {
  type        = string
  description = "Worker username."
}


variable "environment_name" {
  type        = string
  description = "Environment name."
}
