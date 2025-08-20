# Store the backend function name as a variable in GitHub Actions
# resource "github_actions_environment_variable" "aws_backend_function_name" {
#   repository    = data.github_repository.this.name
#   variable_name = "AWS_BACKEND_FUNCTION_NAME"
#   value         = var.aws_backend_function_name
# }

# Store the backend ECR image name as a variable in GitHub Actions
resource "github_actions_environment_variable" "aws_lambda_backend_image" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_BACKEND_IMAGE_NAME"
  value         = var.aws_backend_image_name
}

resource "github_actions_environment_variable" "aws_backend_ecs_cluster" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_BACKEND_ECS_CLUSTER"
  value         = var.aws_ecs_cluster_name
}

resource "github_actions_environment_variable" "aws_asg_name" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_ASG_NAME"
  value         = var.aws_asg_name
}


resource "github_actions_environment_variable" "aws_backend_ecs_service" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_BACKEND_ECS_SERVICE"
  value         = var.aws_ecs_service_name
}




resource "github_actions_environment_variable" "aws_backend_ecs_task_family" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_BACKEND_ECS_TASK_FAMILY"
  value         = var.aws_ecs_task_family
}


resource "github_actions_environment_variable" "aws_worker_function_name" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_WORKER_FUNCTION_NAME"
  value         = var.aws_worker_function_name
}

resource "github_actions_environment_variable" "aws_automation_generate_wa_messages_function_name" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_AUTOMATION_GENERATE_WA_MESSAGES_FUNCTION_NAME"
  value         = var.aws_automation_generate_wa_messages_function_name
}

# Store the worker ECR image name as a variable in GitHub Actions
resource "github_actions_environment_variable" "aws_lambda_worker_image" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_WORKER_IMAGE_NAME"
  value         = var.aws_worker_image_name
}



resource "github_actions_environment_variable" "aws_region" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "AWS_REGION"
  value         = var.aws_region
}


# SST variables and secrets

resource "github_actions_environment_variable" "sst_api_url" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_API_URL"
  value         = var.sst_api_url
}

resource "github_actions_environment_variable" "sst_vpc_id" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_VPC_ID"
  value         = var.sst_vpc_id
}

resource "github_actions_environment_variable" "sst_accounts_domain" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_ACCOUNTS_DOMAIN"
  value         = var.sst_accounts_domain
}

resource "github_actions_environment_variable" "sst_seeker_portal_domain" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_SEEKER_PORTAL_DOMAIN"
  value         = var.sst_seeker_portal_domain
}

resource "github_actions_environment_variable" "sst_recruiter_portal_domain" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_RECRUITER_PORTAL_DOMAIN"
  value         = var.sst_recruiter_portal_domain
}

resource "github_actions_environment_variable" "sst_recruiter_dashboard_domain" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_RECRUITER_DASHBOARD_DOMAIN"
  value         = var.sst_recruiter_dashboard_domain
}

resource "github_actions_environment_variable" "sst_captcha_site_key" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_CAPTCHA_SITE_KEY"
  value         = var.sst_captcha_site_key
}

resource "github_actions_environment_variable" "sst_recruiter_portal_base_url" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_RECRUITER_PORTAL_BASE_URL"
  value         = var.sst_recruiter_portal_base_url
}

resource "github_actions_environment_variable" "sst_seeker_portal_base_url" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_SEEKER_PORTAL_BASE_URL"
  value         = var.sst_seeker_portal_base_url
}

resource "github_actions_environment_variable" "sst_accounts_base_url" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_ACCOUNTS_BASE_URL"
  value         = var.sst_accounts_base_url
}


resource "github_actions_environment_variable" "sst_vpc_private_subnets" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_VPC_PRIVATE_SUBNETS"
  # comma‑delimited list
  value = var.sst_vpc_private_subnets
}
resource "github_actions_environment_variable" "sst_vpc_security_groups" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SST_VPC_SECURITY_GROUPS"
  value         = var.sst_vpc_security_groups
}

resource "github_actions_environment_variable" "recruiter_portal_sentry_project" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "RECRUITER_PORTAL_SENTRY_PROJECT"
  value         = var.sentry_recruiter_portal_ui_project
}
resource "github_actions_environment_variable" "recruiter_dashboard_sentry_project" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "RECRUITER_DASHBOARD_SENTRY_PROJECT"
  value         = var.sentry_recruiter_dashboard_ui_project
}

resource "github_actions_environment_variable" "seeker_portal_sentry_project" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SEEKER_PORTAL_SENTRY_PROJECT"
  value         = var.sentry_seeker_portal_ui_project
}

resource "github_actions_environment_variable" "accounts_sentry_project" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "ACCOUNTS_SENTRY_PROJECT"
  value         = var.sentry_accounts_ui_project
}


resource "github_actions_environment_variable" "sentry_organization" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "SENTRY_ORGANIZATION"
  value         = var.sentry_organization
}


resource "github_actions_environment_variable" "public_root_domain" {
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "PUBLIC_ROOT_DOMAIN"
  value         = var.domain_name
}


resource "github_actions_environment_variable" "staging_db_setup_lambda_function_arn" {
  count         = var.environment_name == "staging" ? 1 : 0
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "STAGING_DB_SETUP_LAMBDA_FUNCTION_ARN"
  value         = var.staging_db_setup_lambda_function_arn
}

resource "github_actions_environment_variable" "staging_db_teardown_lambda_function_arn" {
  count         = var.environment_name == "staging" ? 1 : 0
  repository    = data.github_repository.this.name
  environment   = github_repository_environment.this.environment
  variable_name = "STAGING_DB_TEARDOWN_LAMBDA_FUNCTION_ARN"
  value         = var.staging_db_teardown_lambda_function_arn
}
