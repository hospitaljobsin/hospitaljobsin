terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    google = {
      source  = "hashicorp/google"
      version = "~> 6.31"
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
  }

  backend "remote" {
    organization = "HospitalJobsIN"

    workspaces {
      name = "main"
    }
  }
}


provider "aws" {
  region            = var.aws_region
  s3_use_path_style = true
}

provider "google" {
  region  = var.google_region
  project = var.google_project
}

# Configure the MongoDB Atlas Provider 
provider "mongodbatlas" {}

# Configure the GitHub Provider
provider "github" {}
