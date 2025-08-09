terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }

    sentry = {
      source  = "jianyuan/sentry"
      version = "0.14.5"
    }
  }

  backend "s3" {
    key = "shared.terraform.tfstate"
  }
}


provider "aws" {
  region            = var.aws_region
  s3_use_path_style = true
}


module "sentry" {
  source                      = "../modules/sentry"
  sentry_organization_slug    = var.sentry_organization_slug
  github_organization_name    = var.github_organization_name
  github_repository_full_name = var.github_repository_full_name
  domain_name                 = var.domain_name
}
