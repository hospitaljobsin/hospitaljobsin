terraform {
  required_version = ">= 1.3.0"

  required_providers {
  }

  backend "s3" {
    key = "prod.terraform.tfstate"
  }
}


data "terraform_remote_state" "shared" {
  backend = "s3"

  config = {
    bucket = "hjterraformstate"
    key    = "shared.terraform.tfstate"
    region = "us-east-1"
  }
}


module "github" {
  source                   = "../modules/github"
  github_organization_name = var.github_organization_name
  environment_name         = "production"
  # aws_backend_function_name             = module.core.aws_lambda_backend_function_name
  aws_backend_image_name                = data.terraform_remote_state.shared.outputs.aws_lambda_backend_image
  aws_worker_function_name              = module.core.aws_lambda_worker_function_name
  aws_worker_image_name                 = data.terraform_remote_state.shared.outputs.aws_lambda_worker_image
  aws_region                            = var.aws_region
  github_repository_full_name           = var.github_repository_full_name
  sentry_accounts_ui_dsn                = data.terraform_remote_state.shared.outputs.sentry_accounts_ui_dsn
  sentry_seeker_portal_ui_dsn           = data.terraform_remote_state.shared.outputs.sentry_seeker_portal_ui_dsn
  sentry_recruiter_portal_ui_dsn        = data.terraform_remote_state.shared.outputs.sentry_recruiter_portal_ui_dsn
  sentry_recruiter_dashboard_ui_dsn     = data.terraform_remote_state.shared.outputs.sentry_recruiter_dashboard_ui_dsn
  sst_api_url                           = module.core.sst_api_url
  sst_vpc_id                            = data.terraform_remote_state.shared.outputs.vpc_id
  sst_accounts_domain                   = module.core.sst_accounts_domain
  sst_seeker_portal_domain              = module.core.sst_seeker_portal_domain
  sst_recruiter_portal_domain           = module.core.sst_recruiter_portal_domain
  sst_recruiter_dashboard_domain        = module.core.sst_recruiter_dashboard_domain
  sst_accounts_secret_id                = module.core.sst_accounts_secret_id
  sst_seeker_portal_secret_id           = module.core.sst_seeker_portal_secret_id
  deployment_aws_access_key_id          = data.terraform_remote_state.shared.outputs.aws_access_key_id
  deployment_aws_secret_access_key      = data.terraform_remote_state.shared.outputs.aws_secret_access_key
  sentry_backend_dsn                    = data.terraform_remote_state.shared.outputs.sentry_backend_dsn
  sst_accounts_base_url                 = module.core.sst_accounts_base_url
  sst_seeker_portal_base_url            = module.core.sst_seeker_portal_base_url
  sst_recruiter_portal_base_url         = module.core.sst_recruiter_portal_base_url
  sst_captcha_site_key                  = module.cloudflare.sst_captcha_site_key
  sentry_organization                   = data.terraform_remote_state.shared.outputs.sentry_organization
  sst_recruiter_portal_secret_id        = module.core.sst_recruiter_portal_secret_id
  sst_recruiter_dashboard_secret_id     = module.core.sst_recruiter_dashboard_secret_id
  sst_vpc_private_subnets               = module.core.sst_vpc_private_subnets
  sst_vpc_security_groups               = module.core.sst_vpc_security_groups
  domain_name                           = var.domain_name
  sentry_accounts_ui_project            = data.terraform_remote_state.shared.outputs.accounts_sentry_project
  sentry_recruiter_portal_ui_project    = data.terraform_remote_state.shared.outputs.recruiter_portal_sentry_project
  sentry_recruiter_dashboard_ui_project = data.terraform_remote_state.shared.outputs.recruiter_dashboard_sentry_project
  sentry_seeker_portal_ui_project       = data.terraform_remote_state.shared.outputs.seeker_portal_sentry_project
  aws_ecs_cluster_name                  = module.core.aws_ecs_cluster_name
  aws_ecs_service_name                  = module.core.aws_ecs_service_name
  aws_ecs_task_family                   = module.core.aws_ecs_task_family
}


module "core" {
  source                            = "../modules/aws-core"
  environment_name                  = "production"
  app_name                          = var.app_name
  aws_region                        = var.aws_region
  turnstile_widget_secret           = module.cloudflare.turnstile_widget_secret
  domain_name                       = var.domain_name
  google_oauth_client_id            = var.google_oauth_client_id
  google_oauth_client_secret        = var.google_oauth_client_secret
  resource_prefix                   = var.resource_prefix
  sentry_backend_dsn                = data.terraform_remote_state.shared.outputs.sentry_backend_dsn
  sentry_accounts_ui_dsn            = data.terraform_remote_state.shared.outputs.sentry_accounts_ui_dsn
  sentry_recruiter_portal_ui_dsn    = data.terraform_remote_state.shared.outputs.sentry_recruiter_portal_ui_dsn
  sentry_seeker_portal_ui_dsn       = data.terraform_remote_state.shared.outputs.sentry_seeker_portal_ui_dsn
  redis_password                    = module.redis.redis_password
  redis_endpoint                    = module.redis.public_endpoint
  whatsapp_access_token             = var.whatsapp_access_token
  whatsapp_phone_number_id          = var.whatsapp_phone_number_id
  two_factor_in_api_key             = var.two_factor_in_api_key
  posthog_api_key                   = var.posthog_api_key
  posthog_api_host                  = var.posthog_api_host
  mongodb_connection_string         = module.mongodb.connection_string
  mongodb_database_name             = var.mongodb_database_name
  vpc_id                            = data.terraform_remote_state.shared.outputs.vpc_id
  hosted_zone_id                    = data.terraform_remote_state.shared.outputs.hosted_zone_id
  aws_lambda_worker_repository_url  = data.terraform_remote_state.shared.outputs.aws_lambda_worker_repository_url
  aws_lambda_backend_repository_url = data.terraform_remote_state.shared.outputs.aws_lambda_backend_repository_url
}

module "mongodb" {
  source                = "../modules/mongodb"
  environment_name      = "production"
  mongodb_atlas_org_id  = var.mongodb_atlas_org_id
  mongodb_atlas_region  = var.mongodb_atlas_region
  mongodb_database_name = var.mongodb_database_name
  resource_prefix       = var.resource_prefix
  ecs_username          = module.core.ecs_username
  lambda_username       = module.core.lambda_username
  worker_username       = module.core.worker_username
}

module "redis" {
  source          = "../modules/redis"
  aws_region      = var.aws_region
  resource_prefix = var.resource_prefix
}


module "cloudflare" {
  source                = "../modules/cloudflare"
  cloudflare_account_id = var.cloudflare_account_id
  domain_name           = var.domain_name
}
