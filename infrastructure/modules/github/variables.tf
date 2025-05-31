variable "github_repository_full_name" {
  type        = string
  description = "GitHub repository name."
}

variable "github_organization_name" {
  type        = string
  description = "GitHub organization name."

}

variable "aws_backend_function_name" {
  type        = string
  description = "The name of the AWS Lambda function for the backend."
}


variable "aws_backend_image_name" {
  type        = string
  description = "The name of the AWS ECR image for the backend."
}

variable "aws_region" {
  type        = string
  description = "The AWS region to deploy resources in."
}


variable "sst_api_url" {
  type        = string
  description = "The API URL for the SST application."
}

variable "sst_vpc_id" {
  type        = string
  description = "The VPC ID for the SST application."
}

variable "sst_accounts_domain" {
  type        = string
  description = "The domain for the accounts service."
}

variable "sst_seeker_portal_domain" {
  type        = string
  description = "The domain for the seeker portal."
}

variable "sst_recruiter_portal_domain" {
  type        = string
  description = "The domain for the recruiter portal."
}

variable "sentry_backend_dsn" {
  type        = string
  description = "The Sentry DSN for the backend."
  sensitive   = true
}

variable "sentry_accounts_ui_dsn" {
  type        = string
  description = "The Sentry DSN for the accounts UI."
  sensitive   = true
}

variable "sentry_seeker_portal_ui_dsn" {
  type        = string
  description = "The Sentry DSN for the seeker portal UI."
  sensitive   = true
}

variable "sentry_recruiter_portal_ui_dsn" {
  type        = string
  description = "The Sentry DSN for the recruiter portal UI."
  sensitive   = true
}


variable "sentry_organization" {
  description = "The slug of the Sentry organization."
  type        = string
}


variable "sst_captcha_site_key" {
  description = "The site key for the CAPTCHA."
  type        = string
}

variable "sst_recruiter_portal_base_url" {
  description = "The base URL for the recruiter portal."
  type        = string
}

variable "sst_seeker_portal_base_url" {
  description = "The base URL for the seeker portal."
  type        = string
}

variable "sst_accounts_base_url" {
  description = "The base URL for the accounts service."
  type        = string
}


variable "sst_vpc_private_subnets" {
  description = "The private subnets in the VPC."
  type        = string
}

variable "sst_vpc_security_groups" {
  description = "The security groups in the VPC."
  type        = string
}

variable "sst_accounts_secret_id" {
  description = "The secret ID for the accounts service."
  type        = string
  sensitive   = true
}

variable "sst_seeker_portal_secret_id" {
  description = "The secret ID for the seeker portal."
  type        = string
  sensitive   = true
}

variable "sst_recruiter_portal_secret_id" {
  description = "The secret ID for the recruiter portal."
  type        = string
  sensitive   = true
}


variable "deployment_aws_access_key_id" {
  description = "The AWS Access Key ID for deployment."
  type        = string
  sensitive   = true
}


variable "deployment_aws_secret_access_key" {
  description = "The AWS Secret Access Key for deployment."
  type        = string
  sensitive   = true
}
