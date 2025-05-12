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
      version = "~> 4"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "3.4.0"
    }

    sentry = {
      source  = "jianyuan/sentry"
      version = "0.14.5"
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


module "sentry" {
  source                   = "./modules/sentry"
  sentry_organization_slug = var.sentry_organization_slug
  github_organization_name = var.github_organization_name
  github_repository_name   = var.github_repository_name
}

module "core" {
  source                         = "./modules/core"
  app_name                       = var.app_name
  aws_region                     = var.aws_region
  cloudflare_acount_id           = var.cloudflare_acount_id
  domain_name                    = var.domain_name
  github_repository_name         = var.github_repository_name
  google_oauth_client_id         = var.google_oauth_client_id
  google_oauth_client_secret     = var.google_oauth_client_secret
  mongodb_atlas_org_id           = var.mongodb_atlas_org_id
  mongodb_atlas_region           = var.mongodb_atlas_region
  mongodb_database_name          = var.mongodb_database_name
  resource_prefix                = var.resource_prefix
  support_email                  = var.support_email
  sentry_backend_dsn             = module.sentry.sentry_backend_dsn
  sentry_accounts_ui_dsn         = module.sentry.sentry_accounts_ui_dsn
  sentry_recruiter_portal_ui_dsn = module.sentry.sentry_recruiter_portal_ui_dsn
  sentry_seeker_portal_ui_dsn    = module.sentry.sentry_seeker_portal_ui_dsn
}



