output "sentry_backend_dsn" {
  value     = module.sentry.sentry_backend_dsn
  sensitive = true
}


output "sentry_accounts_ui_dsn" {
  value     = module.sentry.sentry_accounts_ui_dsn
  sensitive = true
}


output "sentry_seeker_portal_ui_dsn" {
  value     = module.sentry.sentry_seeker_portal_ui_dsn
  sensitive = true
}


output "sentry_recruiter_portal_ui_dsn" {
  value     = module.sentry.sentry_recruiter_portal_ui_dsn
  sensitive = true
}


output "sentry_recruiter_dashboard_ui_dsn" {
  value     = module.sentry.sentry_recruiter_dashboard_ui_dsn
  sensitive = true
}

output "recruiter_portal_sentry_project" {
  value = module.sentry.recruiter_portal_sentry_project
}

output "recruiter_dashboard_sentry_project" {
  value = module.sentry.recruiter_dashboard_sentry_project
}


output "seeker_portal_sentry_project" {
  value = module.sentry.seeker_portal_sentry_project
}

output "accounts_sentry_project" {
  value = module.sentry.accounts_sentry_project
}


output "sentry_organization" {
  value = module.sentry.sentry_organization
}


# AWS Foundation

output "vpc_id" {
  value = module.aws-foundation.vpc_id
}

output "vpc_private_subnets" {
  # comma‑delimited list
  value = module.aws-foundation.vpc_private_subnets
}

output "vpc_security_groups" {
  value = module.aws-foundation.vpc_security_groups
}


output "hosted_zone_id" {
  value = module.aws-foundation.hosted_zone_id
}


# Store the backend ECR image name as a variable in GitHub Actions
output "aws_lambda_worker_image" {
  value = module.aws-foundation.aws_lambda_worker_image
}

output "aws_lambda_worker_repository_url" {
  value = module.aws-foundation.aws_lambda_worker_repository_url
}

output "aws_lambda_worker_repository_arn" {
  value = module.aws-foundation.aws_lambda_worker_repository_arn
}

output "aws_lambda_backend_image" {
  value = module.aws-foundation.aws_lambda_backend_image
}

output "aws_lambda_backend_repository_url" {
  value = module.aws-foundation.aws_lambda_backend_repository_url
}

output "aws_lambda_backend_repository_arn" {
  value = module.aws-foundation.aws_lambda_backend_repository_arn
}

# Store the AWS Access Key ID as a GitHub Actions secret
output "aws_access_key_id" {
  value     = module.aws-foundation.aws_access_key_id
  sensitive = true
}

# Store the AWS Secret Access Key as a GitHub Actions secret
output "aws_secret_access_key" {
  value     = module.aws-foundation.aws_secret_access_key
  sensitive = true
}
