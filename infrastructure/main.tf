terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    random = {
      source  = "hashicorp/random"
      version = ">= 3.0"
    }
  }

#   backend "remote" {
#     organization = "aryaniyaps"

#     workspaces {
#       name = "medical-jobs"
#     }
#   }
}


provider "aws" {
  region = var.aws_region
}