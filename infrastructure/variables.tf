variable "app_name" {
  type    = string
  default = "Hospital Job Board"
}

variable "resource_prefix" {
  type        = string
  description = "The prefix to use for all resources."
  default     = "hj"
}


variable "region" {
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
