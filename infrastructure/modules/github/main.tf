terraform {
  required_version = ">= 1.3.0"

  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}


data "github_repository" "this" {
  full_name = var.github_repository_full_name
}
