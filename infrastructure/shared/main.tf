terraform {
  required_version = ">= 1.3.0"

  required_providers {
  }

  backend "s3" {
    key = "shared.terraform.tfstate"
  }
}

module "sentry" {
  source                      = "../modules/sentry"
  sentry_organization_slug    = var.sentry_organization_slug
  github_organization_name    = var.github_organization_name
  github_repository_full_name = var.github_repository_full_name
  domain_name                 = var.domain_name
}

module "aws-foundation" {
  source                 = "../modules/aws-foundation"
  aws_region             = var.aws_region
  resource_prefix        = var.resource_prefix
  domain_name            = var.domain_name
  github_repository_name = var.github_repository_name
}
