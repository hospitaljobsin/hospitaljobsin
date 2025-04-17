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
  }

  backend "remote" {
    organization = "HospitalJobsIN"

    workspaces {
      name = "medical-job-board"
    }
  }
}


provider "aws" {
  region = var.region
}

# Configure the MongoDB Atlas Provider 
provider "mongodbatlas" {}
