terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.33"
    }

    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "3.6.0"
    }

    sentry = {
      source  = "jianyuan/sentry"
      version = "0.14.5"
    }

    rediscloud = {
      source  = "RedisLabs/rediscloud"
      version = "2.1.4"
    }
  }

  backend "s3" {
    key = "prod.terraform.tfstate"
  }
}


provider "aws" {
  region            = var.aws_region
  s3_use_path_style = true
}

# Configure the MongoDB Atlas Provider
provider "mongodbatlas" {}

# Configure the GitHub Provider
provider "github" {}

module "github" {
  source                   = "./modules/github"
  github_organization_name = var.github_organization_name
  # aws_backend_function_name             = module.core.aws_lambda_backend_function_name
  aws_backend_image_name                = module.core.aws_lambda_backend_image
  aws_worker_function_name              = module.core.aws_lambda_worker_function_name
  aws_worker_image_name                 = module.core.aws_lambda_worker_image
  aws_region                            = var.aws_region
  github_repository_full_name           = var.github_repository_full_name
  sentry_accounts_ui_dsn                = module.sentry.sentry_accounts_ui_dsn
  sentry_seeker_portal_ui_dsn           = module.sentry.sentry_seeker_portal_ui_dsn
  sentry_recruiter_portal_ui_dsn        = module.sentry.sentry_recruiter_portal_ui_dsn
  sentry_recruiter_dashboard_ui_dsn     = module.sentry.sentry_recruiter_dashboard_ui_dsn
  sst_api_url                           = module.core.sst_api_url
  sst_vpc_id                            = module.core.sst_vpc_id
  sst_accounts_domain                   = module.core.sst_accounts_domain
  sst_seeker_portal_domain              = module.core.sst_seeker_portal_domain
  sst_recruiter_portal_domain           = module.core.sst_recruiter_portal_domain
  sst_recruiter_dashboard_domain        = module.core.sst_recruiter_dashboard_domain
  sst_accounts_secret_id                = module.core.sst_accounts_secret_id
  sst_seeker_portal_secret_id           = module.core.sst_seeker_portal_secret_id
  deployment_aws_access_key_id          = module.core.aws_access_key_id
  deployment_aws_secret_access_key      = module.core.aws_secret_access_key
  sentry_backend_dsn                    = module.sentry.sentry_backend_dsn
  sst_accounts_base_url                 = module.core.sst_accounts_base_url
  sst_seeker_portal_base_url            = module.core.sst_seeker_portal_base_url
  sst_recruiter_portal_base_url         = module.core.sst_recruiter_portal_base_url
  sst_captcha_site_key                  = module.core.sst_captcha_site_key
  sentry_organization                   = module.sentry.sentry_organization
  sst_recruiter_portal_secret_id        = module.core.sst_recruiter_portal_secret_id
  sst_recruiter_dashboard_secret_id     = module.core.sst_recruiter_dashboard_secret_id
  sst_vpc_private_subnets               = module.core.sst_vpc_private_subnets
  sst_vpc_security_groups               = module.core.sst_vpc_security_groups
  domain_name                           = var.domain_name
  sentry_accounts_ui_project            = module.sentry.accounts_sentry_project
  sentry_recruiter_portal_ui_project    = module.sentry.recruiter_portal_sentry_project
  sentry_recruiter_dashboard_ui_project = module.sentry.recruiter_dashboard_sentry_project
  sentry_seeker_portal_ui_project       = module.sentry.seeker_portal_sentry_project
  aws_ecs_cluster_name                  = module.core.aws_ecs_cluster_name
  aws_ecs_service_name                  = module.core.aws_ecs_service_name
  aws_ecs_task_family                   = module.core.aws_ecs_task_family
}


module "sentry" {
  source                      = "./modules/sentry"
  sentry_organization_slug    = var.sentry_organization_slug
  github_organization_name    = var.github_organization_name
  github_repository_full_name = var.github_repository_full_name
  domain_name                 = var.domain_name
}

module "core" {
  source                         = "./modules/core"
  app_name                       = var.app_name
  aws_region                     = var.aws_region
  cloudflare_account_id          = var.cloudflare_account_id
  domain_name                    = var.domain_name
  google_oauth_client_id         = var.google_oauth_client_id
  google_oauth_client_secret     = var.google_oauth_client_secret
  mongodb_atlas_org_id           = var.mongodb_atlas_org_id
  mongodb_atlas_region           = var.mongodb_atlas_region
  mongodb_database_name          = var.mongodb_database_name
  resource_prefix                = var.resource_prefix
  sentry_backend_dsn             = module.sentry.sentry_backend_dsn
  sentry_accounts_ui_dsn         = module.sentry.sentry_accounts_ui_dsn
  sentry_recruiter_portal_ui_dsn = module.sentry.sentry_recruiter_portal_ui_dsn
  sentry_seeker_portal_ui_dsn    = module.sentry.sentry_seeker_portal_ui_dsn
  github_repository_name         = var.github_repository_name
  redis_password                 = module.redis.redis_password
  redis_endpoint                 = module.redis.public_endpoint
}

module "redis" {
  source          = "./modules/redis"
  aws_region      = var.aws_region
  resource_prefix = var.resource_prefix
}
