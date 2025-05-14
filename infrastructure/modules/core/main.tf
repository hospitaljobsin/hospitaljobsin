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
      version = "~> 3.5.0"
    }

  }
}


provider "aws" {
  region            = var.aws_region
  s3_use_path_style = true
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}


provider "docker" {
  host = "unix:///var/run/docker.sock"
}
