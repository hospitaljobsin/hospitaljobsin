# Store the backend function name as a variable in GitHub Actions
# output "aws_lambda_backend_function_name" {
#   value = aws_lambda_function.backend.function_name
# }


output "aws_asg_name" {
  value = aws_autoscaling_group.ecs_asg.name
}


output "aws_ecs_cluster_name" {
  value = aws_ecs_cluster.ecs.name
}

output "aws_ecs_service_name" {
  value = aws_ecs_service.app.name
}

output "aws_ecs_task_family" {
  value = "${var.resource_prefix}-app-task"
}

output "aws_lambda_worker_function_name" {
  value = aws_lambda_function.worker.function_name
}




# SST variables and secrets

output "sst_api_url" {
  value = "https://api.${var.domain_name}"
}

output "sst_vpc_id" {
  value = var.vpc_id
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

// Fetch all security groups in the VPC
data "aws_security_groups" "vpc" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }
}

output "sst_vpc_private_subnets" {
  # comma‑delimited list
  value = join(",", data.aws_subnets.private.ids)
}

output "sst_vpc_security_groups" {
  value = join(",", data.aws_security_groups.vpc.ids)
}

output "worker_username" {
  value = aws_iam_role.lambda_worker_exec_role.arn
}

output "lambda_username" {
  value = aws_iam_role.lambda_exec_role.arn
}

output "ecs_username" {
  value = aws_iam_role.ecs_task_execution_role.arn
}


output "basic_auth_username" {
  value = random_string.basic_auth_username.result
}

output "basic_auth_password" {
  value     = random_string.basic_auth_password.result
  sensitive = true
}
