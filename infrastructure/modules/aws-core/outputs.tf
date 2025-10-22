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
  value = module.lambda_workers.worker_function_name
}

output "aws_lambda_automation_generate_wa_messages_function_name" {
  value = module.lambda_workers.automation_generate_wa_messages_function_name
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


output "accounts_sentry_dsn" {
  value     = var.sentry_accounts_ui_dsn
  sensitive = true
}

output "sst_seeker_portal_domain" {
  value = var.domain_name
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

output "recruiter_portal_sentry_dsn" {
  value     = var.sentry_recruiter_portal_ui_dsn
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


output "lambda_username" {
  value = module.lambda_workers.lambda_exec_role_arn
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


# GitHub Actions Runner Outputs
output "actions_runner_security_group_id" {
  value       = aws_security_group.actions_runner.id
  description = "Security Group ID for GitHub Actions runner"
}

output "actions_runner_subnet_id" {
  value       = data.aws_subnets.t3a_compatible_public.ids[0]
  description = "Subnet ID for GitHub Actions runner"
}

output "actions_runner_instance_profile_name" {
  value       = aws_iam_instance_profile.actions_runner.name
  description = "Instance Profile name for GitHub Actions runner"
}

output "actions_runner_instance_type" {
  value       = local.actions_runner_instance_type
  description = "Instance type for GitHub Actions runner"
}

output "actions_runner_ami_id" {
  value       = data.aws_ami.ubuntu.id
  description = "AMI ID for GitHub Actions runner"
}


output "sst_jwe_secret_key" {
  value     = random_bytes.jwe_secret.hex
  sensitive = true
}

output "sst_revalidate_secret" {
  value     = random_bytes.revalidate_secret.hex
  sensitive = true
}


output "worker_username" {
  value = module.lambda_workers.lambda_worker_exec_role_arn
}

output "job_alerts_lambda_username" {
  value = module.lambda_workers.lambda_job_alerts_exec_role_arn
}

output "staging_db_setup_lambda_username" {
  value = module.lambda_workers.lambda_staging_db_exec_role_arn
}
