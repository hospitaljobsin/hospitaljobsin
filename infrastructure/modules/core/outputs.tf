# Store the AWS Access Key ID as a GitHub Actions secret
output "aws_access_key_id" {
  value     = aws_iam_access_key.github_actions.id
  sensitive = true
}

# Store the AWS Secret Access Key as a GitHub Actions secret
output "aws_secret_access_key" {
  value     = aws_iam_access_key.github_actions.secret
  sensitive = true
}


# Store the backend function name as a variable in GitHub Actions
output "aws_lambda_backend_function_name" {
  value = aws_lambda_function.backend.function_name
}

# Store the backend ECR image name as a variable in GitHub Actions
output "aws_lambda_backend_image" {
  value = aws_ecr_repository.backend.name
}


output "aws_lambda_worker_function_name" {
  value = aws_lambda_function.worker.function_name
}

output "aws_lambda_worker_image" {
  value = aws_ecr_repository.worker.name
}


# SST variables and secrets

output "sst_api_url" {
  value = "https://api.${var.domain_name}"
}

output "sst_vpc_id" {
  value = aws_vpc.this.id
}

output "sst_accounts_domain" {
  value = "accounts.${var.domain_name}"
}

output "sst_accounts_secret_id" {
  value     = aws_secretsmanager_secret.accounts.id
  sensitive = true
}

output "accounts_sentry_dsn" {
  value     = var.sentry_accounts_ui_dsn
  sensitive = true
}

output "sst_seeker_portal_domain" {
  value = var.domain_name
}


output "sst_seeker_portal_secret_id" {
  value     = aws_secretsmanager_secret.seeker_portal.id
  sensitive = true
}

output "seeker_portal_sentry_dsn" {
  value     = var.sentry_seeker_portal_ui_dsn
  sensitive = true
}

output "sst_recruiter_portal_domain" {
  value = "recruiter.${var.domain_name}"
}

output "sst_recruiter_dashboard_domain" {
  value = "*.${var.domain_name}"
}

output "sst_recruiter_portal_secret_id" {
  value     = aws_secretsmanager_secret.recruiter_portal.id
  sensitive = true
}

output "recruiter_portal_sentry_dsn" {
  value     = var.sentry_recruiter_portal_ui_dsn
  sensitive = true
}


output "sst_recruiter_dashboard_secret_id" {
  value     = aws_secretsmanager_secret.recruiter_dashboard.id
  sensitive = true
}


output "sst_captcha_site_key" {
  value = cloudflare_turnstile_widget.example.id
}

output "sst_recruiter_portal_base_url" {
  value = "https://recruiter.${var.domain_name}"
}


output "sst_recruiter_dashboard_base_url" {
  value = "https://*.${var.domain_name}"
}

output "sst_seeker_portal_base_url" {
  value = "https://${var.domain_name}"
}

output "sst_accounts_base_url" {
  value = "https://accounts.${var.domain_name}"
}


output "server_sentry_dsn" {
  value     = var.sentry_backend_dsn
  sensitive = true
}

// Fetch private subnets in the VPC

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [aws_vpc.this.id]
  }
  filter {
    name   = "map-public-ip-on-launch"
    values = [false]
  }
}

// Fetch all security groups in the VPC
data "aws_security_groups" "vpc" {
  filter {
    name   = "vpc-id"
    values = [aws_vpc.this.id]
  }
}

output "sst_vpc_private_subnets" {
  # comma‑delimited list
  value = join(",", data.aws_subnets.private.ids)
}

output "sst_vpc_security_groups" {
  value = join(",", data.aws_security_groups.vpc.ids)
}
